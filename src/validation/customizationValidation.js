
// const Validator = require('validator');
import validator from 'validator';
class customizationValidation {
    static icustomFieldValidation(data) {
        const errors = {};
        const doesKeyExist = key => {
            return Object.prototype.hasOwnProperty.call(data, key) || false;
        };
        if (!doesKeyExist(`type`)) {
            errors.type = 'Add key type in ICustomField';
        }
        if (!doesKeyExist(`icon`)) {
            errors.icon = 'Add key icon in ICustomField';
        } if (!doesKeyExist(`color`)) {
            errors.color = 'Add color type in ICustomField';
        } if (!doesKeyExist(`title`)) {
            errors.title = 'Add key title in ICustomField';
        } if (!doesKeyExist(`description`)) {
            errors.description = 'Add key description in ICustomField';
        } if (!doesKeyExist(`isPlaceHolder`)) {
            errors.isPlaceHolder = 'Add key isPlaceHolder in ICustomField';
        }

        return {
            errors,
            isValid: Object.keys(errors).length === 0
        };

    }

    static iccustomFiledDragElementValidation(data) {
        const errors = {};
        const doesKeyExist = key => {
            return Object.prototype.hasOwnProperty.call(data, key) || false;
        };
        if (!doesKeyExist(`x1_axix`)) {
            errors.type = 'Add key x1_axix in iccustomfiledDragElement';
        }
        if (!doesKeyExist(`y_axis`)) {
            errors.y_axis = 'Add key y_axis in iccustomfiledDragElement';
        } if (!doesKeyExist(`x2_axis`)) {
            errors.x2_axis = 'Add key x2_axis type in iccustomfiledDragElement';
        } if (!doesKeyExist(`y2_axis`)) {
            errors.y2_axis = 'Add key y2_axis in iccustomfiledDragElement';
        } if (!doesKeyExist(`width`)) {
            errors.width = 'Add key width in iccustomfiledDragElement';
        } if (!doesKeyExist(`height`)) {
            errors.height = 'Add key height in iccustomfiledDragElement';
        }

        return {
            errors,
            isValid: Object.keys(errors).length === 0
        };

    }

    static icustomizationFieldValidation(data) {
        const errors = {};
        const doesKeyExist = key => {
            return Object.prototype.hasOwnProperty.call(data, key) || false;
        };
        if (!doesKeyExist(`title`)) {
            errors.title = 'Add key title in ICustomization';
        }
        if (!doesKeyExist(`backgroundImage`)) {
            errors.backgroundImage = 'Add key backgroundImage in icustomization';
        } if (!doesKeyExist(`customizationList`)) {
            errors.customizationList = 'Add key customizationList in icustomization';
        }
        if (!doesKeyExist(`isPublished`)) {
            errors.isPublished = 'Add key isPublished in icustomization';
        } if (!doesKeyExist(`groups`)) {
            errors.groups = 'Add key groups in icustomization';
        }

        return {
            errors,
            isValid: Object.keys(errors).length === 0
        };

    }

    static backgroundImageValidation(data) {
        const errors = {};
        const doesKeyExist = key => {
            return Object.prototype.hasOwnProperty.call(data, key) || false;
        };
        if (!doesKeyExist(`image`)) {
            errors.image = 'Add key image in backgroundImage';
        }
        if (!doesKeyExist(`actualDimension`)) {
            errors.actualDimension = 'Add key actualDimension in backgroundImage';
        } if (!doesKeyExist(`scaledDimension`)) {
            errors.scaledDimension = 'Add key scaledDimension in backgroundImage';
        }

        return {
            errors,
            isValid: Object.keys(errors).length === 0
        };

    }

    static imageValidation(data) {
        const errors = {};
        const doesKeyExist = key => {
            return Object.prototype.hasOwnProperty.call(data, key) || false;
        };
        if (!doesKeyExist(`file`)) {
            errors.file = 'Add key file in image';
        }
        if (!doesKeyExist(`cloudUrl`)) {
            errors.cloudUrl = 'Add key cloudUrl in image';
        } if (!doesKeyExist(`localUrl`)) {
            errors.localUrl = 'Add key localUrl in image';
        }

        return {
            errors,
            isValid: Object.keys(errors).length === 0
        };

    }

    static dimensionValidation(data) {
        const errors = {};
        const doesKeyExist = key => {
            return Object.prototype.hasOwnProperty.call(data, key) || false;
        };
        if (!doesKeyExist(`height`)) {
            errors.height = 'Add key file in dimension';
        }
        if (!doesKeyExist(`width`)) {
            errors.width = 'Add key cloudUrl in dimension';
        } if (!doesKeyExist(`rotation`)) {
            errors.rotation = 'Add key rotation in dimension';
        }

        return {
            errors,
            isValid: Object.keys(errors).length === 0
        };

    }

    static customizationListValidation(data) {
        const errors = {};
        const doesKeyExist = key => {
            return Object.prototype.hasOwnProperty.call(data, key) || false;
        };
        if (!doesKeyExist(`icustomItem`)) {
            errors.icustomItem = 'Add key icustomItem in customizationList';
        }

        return {
            errors,
            isValid: Object.keys(errors).length === 0
        };

    }
    static imagePropertyValidation(data) {
        const errors = {};
        const doesKeyExist = key => {
            return Object.prototype.hasOwnProperty.call(data, key) || false;
        };
        if (!doesKeyExist(`image`)) {
            errors.image = 'Add key image in imgProperty';
        }

        return {
            errors,
            isValid: Object.keys(errors).length === 0
        };

    }


    static icustomItemValidation(data) {
        const errors = {};
        const doesKeyExist = key => {
            return Object.prototype.hasOwnProperty.call(data, key) || false;
        };
        if (!doesKeyExist(`position`)) {
            errors.position = 'Add key position in icustomItem';
        }
        if (!doesKeyExist(`type`)) {
            errors.type = 'Add key type in icustomItem';
        } if (!doesKeyExist(`dimension`)) {
            errors.dimension = 'Add key dimension in icustomItem';
        } if (!doesKeyExist(`isPlaceholder`)) {
            errors.isPlaceholder = 'Add key isPlaceholder in icustomItem';
        } if (!doesKeyExist(`icon`)) {
            errors.icon = 'Add key icon in icustomItem';
        } if (!doesKeyExist(`description`)) {
            errors.description = 'Add key description in icustomItem';
        } if (!doesKeyExist(`fieldColor`)) {
            errors.fieldColor = 'Add key fieldColor in icustomItem';
        } if (!doesKeyExist(`groupProperty`)) {
            errors.groupProperty = 'Add key groupProperty in icustomItem';
        } if (!doesKeyExist(`textProperty`)) {
            errors.textProperty = 'Add key textProperty in icustomItem';
        } if (!doesKeyExist(`imgProperty`)) {
            errors.imgProperty = 'Add key imgProperty in icustomItem';
        } if (!doesKeyExist(`touched`)) {
            errors.touched = 'Add key touched in icustomItem';
        } if (!doesKeyExist(`canBeGrouped`)) {
            errors.canBeGrouped = 'Add key canBeGrouped in icustomItem';
        }
        return {
            errors,
            isValid: Object.keys(errors).length === 0
        };

    }


    static groupPropertyValidation(data) {
        const errors = {};
        const doesKeyExist = key => {
            return Object.prototype.hasOwnProperty.call(data, key) || false;
        };
        if (!doesKeyExist(`disableEdit`)) {
            errors.disableEdit = 'Add key disableEdit in groupProperty';
        }
        if (!doesKeyExist(`type`)) {
            errors.type = 'Add key type in groupProperty';
        }
        return {
            errors,
            isValid: Object.keys(errors).length === 0
        };

    }
    static positionValidation(data) {
        const errors = {};
        const doesKeyExist = key => {
            return Object.prototype.hasOwnProperty.call(data, key) || false;
        };
        if (!doesKeyExist(`x_axix`)) {
            errors.x_axix = 'Add key x_axix in position';
        }
        if (!doesKeyExist(`y_axix`)) {
            errors.y_axix = 'Add key y_axix in position';
        }
        return {
            errors,
            isValid: Object.keys(errors).length === 0
        };

    }


    static textPropertyValidation(data) {
        const errors = {};
        const doesKeyExist = key => {
            return Object.prototype.hasOwnProperty.call(data, key) || false;
        };
        if (!doesKeyExist(`minCharacter`)) {
            errors.minCharacter = 'Add key minCharacter in textProperty';
        }
        if (!doesKeyExist(`maxCharacter`)) {
            errors.maxCharacter = 'Add key maxCharacter in textProperty';
        }
        if (!doesKeyExist(`color`)) {
            errors.color = 'Add key color in textProperty';
        } if (!doesKeyExist(`textAlignment`)) {
            errors.textAlignment = 'Add key textAlignment in textProperty';
        } if (!doesKeyExist(`verticalAlignment`)) {
            errors.verticalAlignment = 'Add key verticalAlignment in textProperty';
        } if (!doesKeyExist(`fontSize`)) {
            errors.fontSize = 'Add key fontSize in textProperty';
        } if (!doesKeyExist(`placeholderText`)) {
            errors.placeholderText = 'Add key placeholderText in textProperty';
        }
        return {
            errors,
            isValid: Object.keys(errors).length === 0
        };

    }
}

export default customizationValidation
// module.exports = customizationValidation