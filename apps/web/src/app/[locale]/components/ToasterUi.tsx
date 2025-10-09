import { Toaster } from 'sonner';
import { IconUi } from './ui/icons/IconUi';

const toastIcons = {
    success: <IconUi icon="CHECK_CIRCLE" className="text-success" />,
    error: <IconUi icon="ERROR_CIRCLE" className="text-danger" />,
    info: <IconUi icon="INFO_CIRCLE" className="text-primary" />,
    warning: <IconUi icon="WARNING" className="text-warning" />,
};

export const ToasterUi = () => {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                className:
                    'max-w-sm rounded-lg shadow-lg ring-1 ring-black/5 p-4 flex items-center space-x-3',
            }}
            icons={toastIcons}
            visibleToasts={5}
        />
    );
};
