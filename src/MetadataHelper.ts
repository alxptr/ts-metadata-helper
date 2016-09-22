import 'core-js/es7/reflect';

import {Utils} from './Utils';

import {
    IAnnotationMetadata,
    ANNOTATIONS_METADATA,
    PROP_METADATA,
    IMetadataDefinition,
    IAnnotation,
    IDecorator,
    AnnotationType
} from './MetadataFactory';

export interface IAnnotationMetadataHolder {
    [index:string]:IAnnotationMetadata
}

export class MetadataHelper {

    public static findAnnotationMetaData(target:Object, annotation:IDecorator):IAnnotationMetadataHolder {
        return MetadataHelper.findMetadata(target, annotation, ANNOTATIONS_METADATA);
    }

    public static findPropertyMetadata(target:Object, annotation:IDecorator):IAnnotationMetadataHolder {
        return MetadataHelper.findMetadata(target, annotation, PROP_METADATA);
    }

    public static findMetadata(target:Object, annotation:IDecorator, metadataName:string):IAnnotationMetadataHolder {
        const metadataDefinition:IMetadataDefinition = Reflect.getMetadata(metadataName, target.constructor);

        let annotationMetadataInstance:IAnnotationMetadata;
        let annotationMetadataHolder:IAnnotationMetadataHolder = {} as IAnnotationMetadataHolder;

        if (Utils.isPresent(metadataDefinition)) {
            Reflect.ownKeys(metadataDefinition).forEach((propertyKey:string) => {

                const predicate:{(value:AnnotationType)} = (annotationInstance:AnnotationType):boolean => {
                    const annotationMetadata:IAnnotationMetadata = (annotation as IAnnotation).annotationMetadata;
                    return annotationInstance instanceof annotation // Angular2 annotations support
                        || (Utils.isPresent(annotationMetadata) && annotationInstance instanceof annotationMetadata)
                };

                if (annotationMetadataInstance = metadataDefinition[propertyKey].find(predicate)) {
                    Reflect.set(annotationMetadataHolder, propertyKey, annotationMetadataInstance);
                }
            });
        }
        return annotationMetadataHolder;
    }
}

declare module Reflect {
    function getMetadata(metadataKey:any, target:Object):any
    function ownKeys(target:any):Array<PropertyKey>;
    function set(target:any, propertyKey:PropertyKey, value:any, receiver?:any):boolean;
}
