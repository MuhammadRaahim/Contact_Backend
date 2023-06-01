const express = require('express');
const contactControler = require('../controlers/contactControllers');
const validateToken = require('../middleware/validateTokkenHandler');

const contactRouter = express.Router();


contactRouter.get('/contacts', contactControler.getContacts);
contactRouter.get('/contact/:id', validateToken,contactControler.getContact);
contactRouter.post('/contacts', validateToken,contactControler.addContact);
contactRouter.put('/update-contacts/:id', validateToken,contactControler.updateContact);
contactRouter.delete('/delete-contacts/:id', validateToken,contactControler.deleteContact);


module.exports = contactRouter