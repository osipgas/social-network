import express from 'express'
const router = express.Router()

import {login, profile, register, uploadDescription} from'../Controllers/userController.js'
import {uploadProfilePhoto, upload} from '../Controllers/photoController.js'

// Логин пользователя
router.post('/login', login)
// Берем инфу профиля юзера
router.post('/profile', profile)
// Регистрация пользователя
router.post('/register', register)
// Обновление описания профиля
router.post('/upload-description', uploadDescription)

// загружаем фото
router.post("/upload-profile", upload.single("profileImage"), uploadProfilePhoto)

export default router