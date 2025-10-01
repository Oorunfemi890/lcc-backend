'use strict';

(() => {

    module.exports = {
        createAdmin: require('./create-admin.schema'),
        updateAdmin: require('./admin-update.schema'),
        deleteAdmin: require('./admin-delete.schema'),
        adminResetPassword: require('./admin-reset-password.schema'),
        adminLogin: require('./admin-login.schema'),
        adminForgotPassword: require('./admin-forgot-password.schema'),
        adminFindAllSchema: require('./admin-find-all.schema'),
        adminChangePassword: require('./admin-change-password.schema'),
        adminResetProfile: require('./admin-edit-profile.schema'),
        findAminById : require('./find-admin-by-id.schema')
    };

})();