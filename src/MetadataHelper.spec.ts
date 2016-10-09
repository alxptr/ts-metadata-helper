import {Input, Output, Component} from '@angular/core';

import {PropertyAnnotationFactory, IAnnotation} from './MetadataFactory';

import {
    MetadataHelper,
    IAnnotationMetadataHolder
} from './MetadataHelper';

describe('MetadataHelper', ()=> {
    describe('Checking the MetadataHelper functionality', ()=> {

        it('MetadataHelper should work correctly', ()=> {

            class ViewFieldMetadata {
                configValue:number;

                constructor(config) {
                    this.configValue = config.configValue;
                }
            }

            const ViewField:IAnnotation = PropertyAnnotationFactory(ViewFieldMetadata);

            @Component({
                template: '<div>Template</div>'
            })
            class View {
                @ViewField({configValue: 100})
                private field1:string;

                @ViewField({configValue: 200})
                private field2:number;

                @Input()
                private field3:number;

                @Input()
                private field4:number;

                @Output()
                private field5:number;
            }

            const viewInstance:View = new View();

            expect(Object.keys(MetadataHelper.findPropertyMetadata(viewInstance, ViewField))).toEqual(['field1', 'field2']);
            expect(Object.keys(MetadataHelper.findPropertyMetadata(viewInstance, Input))).toEqual(['field3', 'field4']);
            expect(Object.keys(MetadataHelper.findPropertyMetadata(viewInstance, Output))).toEqual(['field5']);

            const annotationMetadataHolder:IAnnotationMetadataHolder = MetadataHelper.findPropertyMetadata(viewInstance, ViewField);
            expect(Reflect.get(Reflect.get(annotationMetadataHolder, 'field1'), 'configValue')).toBe(100);
            expect(Reflect.get(Reflect.get(annotationMetadataHolder, 'field2'), 'configValue')).toBe(200);

            expect(
                Reflect.get(MetadataHelper.findAnnotationsMetaData(View, Component)[0], 'template')
            ).toEqual('<div>Template</div>');

            class WithoutAnnotations {
            }
            expect(MetadataHelper.findAnnotationsMetaData(WithoutAnnotations, Component).length).toBe(0);
        });
    });
});
