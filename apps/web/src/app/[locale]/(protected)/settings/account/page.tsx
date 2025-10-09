import { AccountForm } from '@web/components/settings/account/account-form';
import { ContentSection } from '@web/components/settings/components/content-section';

export default function SettingsAccountPage() {
    return (
        <ContentSection
            title="Account"
            desc="Update your account settings. Set your preferred language and
          timezone."
        >
            <AccountForm />
        </ContentSection>
    );
}
