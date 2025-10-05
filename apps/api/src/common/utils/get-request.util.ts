import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { BusinessException } from '../exceptions/business.exception';

export const getRequest = <T extends Request>(context: ExecutionContext): T => {
    const contextType = context.getType();

    if (contextType === 'http') {
        return context.switchToHttp().getRequest<T>();
    }

    throw new BusinessException({
        code: 'common.unsupportedContextType',
        args: { type: contextType },
    });
};
