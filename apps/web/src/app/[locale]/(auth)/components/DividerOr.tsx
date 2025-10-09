import { Separator } from '@repo/ui/components/separator';

export const DividerOr = () => (
    <div className="flex items-center gap-3 py-1">
        <Separator className="flex-1" />
        <p className="shrink-0 text-tiny text-default-500">OR</p>
        <Separator className="flex-1" />
    </div>
);
