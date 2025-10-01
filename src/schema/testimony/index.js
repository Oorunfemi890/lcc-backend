'use strict';


(() => {

    module.exports = {
        testimonyById: require('./testimony.id-schema'),
        testimonyCreate: require('./testimony-create.schema'),
        testimonyGetAll: require('./testimony-get-all.schema'),
        testimonyUpdate: require('./testimony-update.schema'),
    };

})();