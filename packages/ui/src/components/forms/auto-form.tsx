/**
 * ✨ PRAGMATIC ENTERPRISE: Auto-Form System
 *
 * Sistema de forms auto-generados desde schemas Zod
 * - Renderiza automáticamente fields desde schema
 * - Type-safe end-to-end
 * - Integrado con React Hook Form
 * - Loading/error states automáticos
 *
 * @example
 * ```tsx
 * // ¡Solo 3 líneas para un form completo!
 * <AutoForm
 *   schema={loginSchema}
 *   action={loginAction}
 *   submitText="Login"
 * />
 * ```
 */

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ComponentType } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAction } from '../../hooks/use-action';
import { Button } from '../button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../form';
import { Input } from '../input';

interface AutoFormProps<T extends z.ZodType> {
    /**
     * Schema Zod - define la estructura y validaciones
     */
    schema: T;

    /**
     * Server Action a ejecutar
     */
    action: any;

    /**
     * Texto del botón submit
     */
    submitText?: string;

    /**
     * Valores por defecto
     */
    defaultValues?: Partial<z.infer<T>>;

    /**
     * Callback al completar exitosamente
     */
    onSuccess?: (data: any) => void;

    /**
     * Componentes custom por field (opcional)
     * Para casos donde necesites un componente específico
     */
    fieldComponents?: Record<string, ComponentType<any>>;

    /**
     * Configuración de fields (opcional)
     * Para personalizar labels, placeholders, etc
     */
    fieldConfig?: Record<
        string,
        {
            label?: string;
            placeholder?: string;
            description?: string;
            type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
        }
    >;
}

/**
 * Auto-Form Component
 * Genera un form completo desde un schema Zod
 */
export function AutoForm<T extends z.ZodType>({
    schema,
    action,
    submitText = 'Submit',
    defaultValues,
    onSuccess,
    fieldComponents,
    fieldConfig = {},
}: AutoFormProps<T>) {
    const form = useForm<z.infer<T>>({
        resolver: zodResolver(schema) as any,
        defaultValues: defaultValues as any,
    });

    const { executeAsync, isExecuting } = useAction(action, {
        onSuccess,
    });

    const onSubmit = async (data: z.infer<T>) => {
        await executeAsync(data);
    };

    // Extraer fields del schema Zod
    const fields = getFieldsFromSchema(schema);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {fields.map((fieldName) => {
                    const config = fieldConfig[fieldName] || {};
                    const CustomComponent = fieldComponents?.[fieldName];

                    return (
                        <FormField
                            key={fieldName}
                            control={form.control}
                            name={fieldName as any}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {config.label || formatFieldName(fieldName)}
                                    </FormLabel>
                                    <FormControl>
                                        {CustomComponent ? (
                                            <CustomComponent {...field} disabled={isExecuting} />
                                        ) : (
                                            <Input
                                                type={config.type || getFieldType(fieldName)}
                                                placeholder={
                                                    config.placeholder ||
                                                    `Enter ${formatFieldName(fieldName).toLowerCase()}`
                                                }
                                                {...field}
                                                disabled={isExecuting}
                                            />
                                        )}
                                    </FormControl>
                                    {config.description && (
                                        <FormDescription>{config.description}</FormDescription>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    );
                })}

                <Button type="submit" className="w-full" disabled={isExecuting}>
                    {isExecuting ? 'Loading...' : submitText}
                </Button>
            </form>
        </Form>
    );
}

/**
 * Helpers
 */

function getFieldsFromSchema(schema: z.ZodType): string[] {
    if (schema instanceof z.ZodObject) {
        return Object.keys(schema.shape);
    }
    return [];
}

function formatFieldName(name: string): string {
    return name
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
        .trim();
}

function getFieldType(fieldName: string): string {
    const lowerName = fieldName.toLowerCase();

    if (lowerName.includes('email')) return 'email';
    if (lowerName.includes('password')) return 'password';
    if (lowerName.includes('phone') || lowerName.includes('tel')) return 'tel';
    if (lowerName.includes('url') || lowerName.includes('website')) return 'url';

    return 'text';
}
