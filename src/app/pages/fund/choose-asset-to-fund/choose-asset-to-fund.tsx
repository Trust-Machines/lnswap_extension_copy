import { useCallback, useMemo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import {
  AllTransferableCryptoAssetBalances,
  BitcoinCryptoCurrencyAssetBalance,
  StacksCryptoCurrencyAssetBalance,
} from '@shared/models/crypto-asset-balance.model';
import { RouteUrls } from '@shared/route-urls';

import { useBtcCryptoCurrencyAssetBalance } from '@app/common/hooks/balance/btc/use-btc-crypto-currency-asset-balance';
import { useStxCryptoCurrencyAssetBalance } from '@app/common/hooks/balance/stx/use-stx-crypto-currency-asset-balance';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { useWalletType } from '@app/common/use-wallet-type';
import { ChooseAssetContainer } from '@app/components/crypto-assets/choose-crypto-asset/choose-asset-container';
import { ChooseCryptoAssetLayout } from '@app/components/crypto-assets/choose-crypto-asset/choose-crypto-asset.layout';
import { CryptoAssetList } from '@app/components/crypto-assets/choose-crypto-asset/crypto-asset-list';
import { ModalHeader } from '@app/components/modal-header';
import { useCheckLedgerBlockchainAvailable } from '@app/store/accounts/blockchain/utils';

type CryptoAssetBalance = BitcoinCryptoCurrencyAssetBalance | StacksCryptoCurrencyAssetBalance;

export function ChooseCryptoAssetToFund() {
  const btcCryptoCurrencyAssetBalance = useBtcCryptoCurrencyAssetBalance();
  const stxCryptoCurrencyAssetBalance = useStxCryptoCurrencyAssetBalance();

  const cryptoCurrencyAssetBalances = useMemo(
    () => [btcCryptoCurrencyAssetBalance, stxCryptoCurrencyAssetBalance],
    [btcCryptoCurrencyAssetBalance, stxCryptoCurrencyAssetBalance]
  );

  const { whenWallet } = useWalletType();
  const navigate = useNavigate();

  const checkBlockchainAvailable = useCheckLedgerBlockchainAvailable();

  const filteredCryptoAssetBalances = useMemo(
    () =>
      cryptoCurrencyAssetBalances
        .filter((assetBalance): assetBalance is CryptoAssetBalance => assetBalance != null)
        .filter(assetBalance =>
          whenWallet({
            ledger: checkBlockchainAvailable(assetBalance?.blockchain),
            software: true,
          })
        ),
    [cryptoCurrencyAssetBalances, checkBlockchainAvailable, whenWallet]
  );

  useRouteHeader(<ModalHeader hideActions onGoBack={() => navigate(RouteUrls.Home)} title=" " />);

  const navigateToSendForm = useCallback(
    (cryptoAssetBalance: AllTransferableCryptoAssetBalances) => {
      const { asset } = cryptoAssetBalance;

      const symbol = asset.symbol === '' ? asset.contractAssetName : asset.symbol;
      navigate(RouteUrls.Fund.replace(':currency', symbol.toUpperCase()));
    },
    [navigate]
  );

  return (
    <>
      <ChooseAssetContainer>
        <ChooseCryptoAssetLayout title="choose asset to fund">
          <CryptoAssetList
            onItemClick={navigateToSendForm}
            cryptoAssetBalances={filteredCryptoAssetBalances}
          />
        </ChooseCryptoAssetLayout>
      </ChooseAssetContainer>
      <Outlet />
    </>
  );
}
