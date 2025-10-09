import { ContentSection } from '@web/components/settings/components/content-section';
import { NotificationsForm } from '@web/components/settings/notifications/notifications-form';

export default function SettingsNotificationsPage() {
    return (
        <ContentSection title="Notifications" desc="Configure how you receive notifications.">
            <NotificationsForm />
        </ContentSection>
    );
}
