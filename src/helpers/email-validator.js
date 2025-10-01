const { resolveMx } = require('dns');

const EMAIL_REGEX = /^[\w!#$%&'*+/=?^`{|}~-]+(?:\.[\w!#$%&'*+/=?^`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const isValidEmail = (email) => {
    if (!email || email.length > 320) return false;

    const [account, address] = email.split('@');
    if (!account || !address || account.length > 64 || address.length > 255) return false;

    const domainParts = address.split('.');
    if (domainParts.some(part => part.length > 63)) return false;

    return EMAIL_REGEX.test(email);
};

const emailValidator = async (value) => {
    if (!isValidEmail(value)) {
        throw new Error( 'Invalid email format');
    }

    const domain = value.split('@')[1];
    try {
        const addresses = await new Promise((resolve, reject) => {
            resolveMx(domain, (err, addresses) => {
                if (err) return reject(err);
                resolve(addresses);
            });
        });

        if (addresses.length === 0) {
            throw new Error(`Email domain "${domain}" does not exist`);
            
        }
        
        return { status: true };
    } catch {
        throw new Error(`Email domain "${domain}" is not valid or does not exist`);
    }
};


module.exports = emailValidator;