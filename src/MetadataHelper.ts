import {Utils} from './Utils';

import {
    IAnnotationMetadata,
    ANNOTATIONS_METADATA,
    PROP_METADATA,
    IMetadataDefinition,
    IAnnotation,
    IDecorator,
    AnnotationType,
    DecoratorType
} from './MetadataFactory';

export interface IAnnotationMetadataHolder {
    [index:string]:IAnnotationMetadata
}

export class MetadataHelper {

    public static findAnnotationsMetaData(target:Object, annotation:IDecorator):Array<DecoratorType> {
        return MetadataHelper.findMetadata(target, annotation, ANNOTATIONS_METADATA) as Array<DecoratorType>;
    }

    public static findPropertyMetadata(target:Object, annotation:IDecorator):IAnnotationMetadataHolder {
        return MetadataHelper.findMetadata(target, annotation, PROP_METADATA) as IAnnotationMetadataHolder;
    }

    private static findMetadata(target:Object, annotation:IDecorator, metadataName:string):IAnnotationMetadataHolder|Array<DecoratorType> {
        const annotationsSearch:boolean = target.constructor === Function;

        const metadataDefinition:IMetadataDefinition|Array<DecoratorType> = Reflect.getMetadata(
            metadataName,
            annotationsSearch ? target : target.constructor
        );

        if (annotationsSearch) {
            return (metadataDefinition || []) as Array<DecoratorType>;
        } else {
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
            return annotationMetadataHolder as IAnnotationMetadataHolder;
        }
    }
}

declare module Reflect {
    function getMetadata(metadataKey:any, target:Object):any
    function ownKeys(target:any):Array<PropertyKey>;
    function set(target:any, propertyKey:PropertyKey, value:any, receiver?:any):boolean;
}
