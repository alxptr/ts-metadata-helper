import {PropertyAnnotationFactory} from './MetadataFactory';

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

            const ViewField = PropertyAnnotationFactory(ViewFieldMetadata);

            class View {
                @ViewField({configValue: 100})
                private field1:string;

                @ViewField({configValue: 200})
                private field2:number;
            }

            const viewInstance:View = new View();

            expect(Object.keys(MetadataHelper.findPropertyMetadata(viewInstance, ViewField))).toEqual(['field1', 'field2']);

            const annotationMetadataHolder:IAnnotationMetadataHolder = MetadataHelper.findPropertyMetadata(viewInstance, ViewField);

            expect(annotationMetadataHolder['field1']['configValue']).toBe(100);
            expect(annotationMetadataHolder['field2']['configValue']).toBe(200);
        });
    });
});
