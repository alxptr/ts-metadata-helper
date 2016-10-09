export const PROP_METADATA:string = 'propMetadata';
export const ANNOTATIONS_METADATA:string = 'annotations';

export interface IAnnotationMetadataConfig {
}

export interface IAnnotationMetadata extends Function {
}

export interface IDecorator extends Function {
}

export interface IAnnotation extends IDecorator {
    annotationMetadata:IAnnotationMetadata;
}

export type AnnotationType = {new():IAnnotation};
export type DecoratorType = {new():IDecorator};

export interface IMetadataDefinition {
    [index:string]:Array<AnnotationType>
}

export function PropertyAnnotationFactory(annotationMetadata:IAnnotationMetadata):IAnnotation {
    const Decorator:Function = (config:IAnnotationMetadataConfig) => {
        return (target:Object, propertyKey:string) => {
            const meta:IMetadataDefinition = Reflect.getOwnMetadata(PROP_METADATA, target.constructor) || {};

            meta[propertyKey] = meta[propertyKey] || [];
            meta[propertyKey].push(Reflect.construct(annotationMetadata, [config]));

            Reflect.defineMetadata(PROP_METADATA, meta, target.constructor);
        };
    };

    const Annotation:IAnnotation = Decorator as IAnnotation;
    Annotation.annotationMetadata = annotationMetadata;
    return Annotation;
}

declare module Reflect {
    function defineMetadata(metadataKey:any, metadataValue:any, target:Object):void;
    function getOwnMetadata(metadataKey:any, target:Object):any;
    function construct(target:Function, argumentsList:ArrayLike<any>, newTarget?:any):any;
}
