import { Stack } from '@stacks/ui';

import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { Caption, Title } from '@app/components/typography';
import { PrimaryButton } from '@app/components/primary-button';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';

const providersInfo = {
  transak: {
    title: 'Transak',
    body: 'Non-US residents can purchase STX with credit card, debit card, or bank transfer via Transak.',
    cta: 'Buy on Transak',
  },
  okcoin: {
    title: 'Okcoin',
    body: 'Non-US residents can purchase STX with credit card, debit card, or bank transfer via Okcoin.',
    cta: 'Buy on Okcoin',
  },
};

export interface ProvidersUrl {
  transak: string;
  okcoin: string;
}

interface OnrampProviderLayoutProps {
  provider: string;
  providerUrl: string;
}

export const OnrampProviderLayout = ({ provider, providerUrl }: OnrampProviderLayoutProps) => {
  const { title, cta, body } = providersInfo[provider as keyof ProvidersUrl];
  const analytics = useAnalytics();
  const goToProviderWebsite = () => {
    void analytics.track('select_buy_option', { provider });
    openInNewTab(providerUrl);
  };
  return (
    <Stack overflow="hidden" alignItems="flex-start" spacing="base" mt={5} className="buy-box">
      <Stack spacing="base-tight">
        <Title marginBottom="10">{title}</Title>
        <Caption>{body}</Caption>
      </Stack>
      <PrimaryButton onClick={goToProviderWebsite}>{cta}</PrimaryButton>
    </Stack>
  );
};
