"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const media_controller_1 = require("../controllers/media.controller");
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const router = (0, express_1.Router)();
// All media endpoints are protected for admin
router.use(auth_1.protect);
router.post('/upload', upload_1.uploadImage.single('image'), media_controller_1.uploadImage);
router.post('/upload-multiple', upload_1.uploadImage.array('images', 10), media_controller_1.uploadMultipleImages);
router.get('/', media_controller_1.getMedia);
router.delete('/:id', media_controller_1.deleteMedia);
exports.default = router;
