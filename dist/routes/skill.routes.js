"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const skill_controller_1 = require("../controllers/skill.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public: get visible skills
router.get('/public', (req, res, next) => {
    req.query.public = 'true';
    (0, skill_controller_1.getSkills)(req, res, next);
});
// Admin
router.use(auth_1.protect);
router.get('/', skill_controller_1.getSkills);
router.post('/', skill_controller_1.createSkill);
router.get('/:id', skill_controller_1.getSkillById);
router.put('/:id', skill_controller_1.updateSkill);
router.delete('/:id', skill_controller_1.deleteSkill);
exports.default = router;
