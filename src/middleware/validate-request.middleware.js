require('dotenv').config();
const emailValidator = require('../helpers/email-validator');

function parseSearchBy (req, res, next) {
  const searchBy = req.query.search_by;

  if (searchBy) {
    try {

      // Only attempt to parse if it looks like JSON
      if (typeof searchBy === 'string' && (searchBy.startsWith('{') || searchBy.startsWith('['))) {
        req.query.search_by = JSON.parse(searchBy);
      } else if(typeof searchBy === 'object') {
        req.query.search_by = searchBy;
      } else {
        // Trim any whitespace for non-JSON strings
        req.query.search_by = searchBy.trim();
      }
    } catch (e) {
      return res.status(400).json({ error: 'Invalid search_by format' });
    }
  }

  next();
}


async function validateBody(schemas, req, res) {
  if (!schemas.body) return null;
  
  const { error } = schemas.body.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message, message: error.details[0].message, result: error.details[0].message });
  }

  if (req.body.email) {
    try {
      await emailValidator(req.body.email);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
  
  return null;
}

function validateQuery(schemas, req, res) {
  if (!schemas.query) return null;
  
  const { error } = schemas.query.validate(req.query);
  if (error) {
    return res.status(400).json({ error: error.details[0].message, message: error.details[0].message, result: error.details[0].message });
  }
  
  return null;
}

function validateParams(schemas, req, res) {
  if (!schemas.params) return null;
  
  const { error } = schemas.params.validate(req.params);
  if (error) {
    return res.status(400).json({ error: error.details[0].message, message: error.details[0].message, result: error.details[0].message });
  }
  
  return null;
}


function validateRequest(schemas) {
  return async (req, res, next) => {
    parseSearchBy(req, res, async (err) => {
      if (err) {

        return next(err);
      }

      const bodyError = await validateBody(schemas, req, res);
      if (bodyError) return; 

      const queryError = validateQuery(schemas, req, res);
      if (queryError) return; 

      const paramsError = validateParams(schemas, req, res);
      if (paramsError) return; 


      next();
    });
  };
}

module.exports = validateRequest;
