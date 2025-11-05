import express from 'express'
const router = express.Router()

import {login, profile, register, uploadDescription, searchUsers} from '../Controllers/userController.js'
import {uploadProfilePhoto, upload} from '../Controllers/photoController.js'
import {addFriend, acceptFriend, removeFriend, getFriendsList} from '../Controllers/friendshipsController.js'

// Регистрация пользователя
router.post('/register', register)
// Логин пользователя
router.post('/login', login)

// Берем инфу профиля юзера
router.post('/profile', profile)
// Обновление описания профиля
router.post('/upload-description', uploadDescription)
// загружаем фото
router.post("/upload-profile", upload.single("profileImage"), uploadProfilePhoto)
// Получаем список друзей
router.post('/getFriendsList', getFriendsList)

// Поиск юзеров 
router.post('/search', searchUsers)
// Поиск юзеров 
router.post('/addFriend', addFriend)
// Поиск юзеров 
router.post('/acceptFriend', acceptFriend)
// Поиск юзеров 
router.post('/removeFriend', removeFriend)

export default router