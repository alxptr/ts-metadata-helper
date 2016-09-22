import 'core-js/es7/reflect';

export const PROP_METADATA:string = 'propMetadata';
export const ANNOTATIONS_METADATA:string = 'annotations';

export interface IAnnotationMetadataConfig {
}

export interface IAnnotationMetadata extends Function {
}

export interface IPropertyAnnotation extends Function {
    annotationMetadata:IAnnotationMetadata;
}

export interface IPropMetadataDefinition {
    [index:string]:Array<Function>
}

export function PropertyAnnotationFactory(annotationMetadata:IAnnotationMetadata):Function {

    const PropertyAnnotation:Function = (config:IAnnotationMetadataConfig) => {
        return (target:Object, propertyKey:string) => {
            const meta:IPropMetadataDefinition = Reflect.getOwnMetadata(PROP_METADATA, target.constructor) || {};

            meta[propertyKey] = meta[propertyKey] || [];
            meta[propertyKey].push(Reflect.construct(annotationMetadata, [config]));

            Reflect.defineMetadata(PROP_METADATA, meta, target.constructor);
        };
    };

    (PropertyAnnotation as IPropertyAnnotation).annotationMetadata = annotationMetadata;
    return PropertyAnnotation;
}

declare module Reflect {
    function defineMetadata(metadataKey:any, metadataValue:any, target:Object):void;
    function getOwnMetadata(metadataKey:any, target:Object):any;
    function construct(target:Function, argumentsList:ArrayLike<any>, newTarget?:any):any;
}
