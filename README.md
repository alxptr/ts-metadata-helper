# ts-metadata-helper

An implementation of wrapper ES7 reflect metadata at TypeScript 2.0.  

## Features

Compatible with the **Angular 2.0.0** annotations.  

## Installation

First you need to install the npm module:
```sh
npm install ts-metadata-helper --save
```

## Use

```typescript
import {Input, Output} from '@angular/core';
import {PropertyAnnotationFactory, IAnnotation} from 'ts-metadata-helper';

class ViewFieldMetadata {
    configValue:number;
    constructor(config) {
        this.configValue = config.configValue;
    }
}

const ViewField:IAnnotation = PropertyAnnotationFactory(ViewFieldMetadata);

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
expect(annotationMetadataHolder['field1']['configValue']).toBe(100);
expect(annotationMetadataHolder['field2']['configValue']).toBe(200);
```

## Publish

```sh
npm run deploy
```

## License

Licensed under MIT.