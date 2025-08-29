# Kuznetsov Viacheslav 

# Домашнє завдання 3: goit-node-rest-api

# Крок 1

Створи аккаунт на Render. Після чого в акаунті створи нову базу даних PostgresSQL, яку треба назвати db-contacts:

#cКрок 2

Встанови графічний редактор pgAdmin для зручної роботи з базою даних для PosgresSQL. Підключися до створенної хмарної бази через графічній редактор та створи таблицю contacts .

# Крок 3

Використовуй вихідний код домашньої работи #2 і заміни зберігання контактів з json-файлу на створену тобою базу даних.

Напиши код для створення підключення до PosgresSQL за допомогою Sequelize.
При успішному підключенні виведи в консоль повідомлення "Database connection successful".
Обов'язково обробив помилку підключення. Виведи в консоль повідомлення помилки і заверши процес використовуючи process.exit(1).
У функціях обробки запитів заміни код CRUD-операцій над контактами з файлу, на Sequelize-методи для роботи з колекцією контактів в базі даних.


Sequelize-модель contacts:

const Contact = sequelize.define(
  'contact', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    favorite: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }




# Крок 4

У нас з'явилося в контактах додаткове поле статусу favorite, яке приймає логічне значення true або false. Воно відповідає за те, що в обраному чи ні знаходиться зазначений контакт. Потрібно реалізувати для оновлення статусу контакту новий роутер:

PATCH /api/contacts/:contactId/favorite

Отримує параметр contactId
Отримує body в json-форматі c оновленням поля favorite
Якщо з body все добре, викликає функцію updateStatusContact (contactId, body) (напиши її) для поновлення контакту в базі
За результатом роботи функції повертає оновлений об'єкт контакту і статусом 200. В іншому випадку, повертає json з ключем {"message":"Not found"} і статусом 404
