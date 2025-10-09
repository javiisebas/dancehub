import { ContentSection } from '@web/components/settings/components/content-section';
import { ProfileForm } from '@web/components/settings/profile/profile-form';

export default function SettingsProfilePage() {
    return (
        <ContentSection title="Profile" desc="This is how others will see you on the site.">
            <ProfileForm />
        </ContentSection>
    );
}
