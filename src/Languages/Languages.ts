import { Socket } from "net";

export const Languages =
    [
        {
            name: 'ru',
            words: {
                Settings: 'Настройки',
                Search: 'Поиск',
                TypeMessage: 'Введите сообщение',
                Send: 'Отправить',
                SecretMessage: 'Секретное сообщение',
                PlannedMesssage: 'Запланированное сообщение(soon)',
                Username: 'Логин',
                Edit: 'Изменить',
                SelectAppLanguage: 'Выберите язык приложения',
                SelectAppTheme: 'Выберите тему приложения',
                UploadBackground: 'Тут вы cможете установить своё фон для чатов(soon)',
                LogOut: 'Выйти из аккаунта',
                Close: 'Закрыть',
                Apply: 'Применить',
                CreateRoom: 'Создание новой комнаты',
                RoomName: 'Введите имя комнаты',
                RoomDescription: 'Введите описание',
                Create: 'Создать',
                OtherProducts: 'Остальные продукты',
                Tagline: `Будьте всегда на связи со своими близкими вместe с `,
                LittleTagline: 'Мы постоянно улучшаем качество предоставляемых услуги',
                OpenSviazik: 'Открыть web-sviazik',
                Download: 'Скачать sviazik',
                Email: 'Электронная почта',
                EnterEmail: 'Введите почту',
                Password: 'Пароль',
                EnterPassword: 'Введите пароль',
                LogIn: 'Войти',
                CreateAccount: 'Создать аккаунт',
                RepeatPassword: 'Повторите пароль',
                SubscribeUpdates: 'Подписаться на обновления?',
                Register: 'Регистрация',
                AlreadyAccount: 'Уже есть аккаунт?',
                EnterUsername: 'Введите имя пользователя',
                EmailWillUse: 'Почта будет использоваться для входа в ваш аккаунт',
                ThirdPersons: 'Мы не передаем вашу почту 3 лицам',
                Delete: 'Удалить',
                Scream: 'Крик души',//VideoCall
                Users:'Список пользователей:',
                ShareString:'Ссылка для подключения: ',
                Description:'Описание',
                SearchUser:'Поиск по имени пользователя',
                Sure:'Вы уверены?',
                Deleted:'Удалено',
                Canceled:'Отменено',
                Copy:'Копировать',
                CopySucsess:'Скопированно',
                CardInfo: [
                    {
                        id: 0,
                        name: 'Будь всегда на связи',
                        description: 'Имей возможность общаться с друзьями из любой точки мира'
                    },
                    {
                        id: 1,
                        name: 'Сервера никогда не подведут',
                        description: 'У sviazik есть сервера по всему миру готовые в любой момент обработать твой звонок'
                    },
                    {
                        id: 2,
                        name: 'Не теряйся нигде',
                        description: 'Даже находясь в затруднительном положении не забывай позвонить своей собачке'
                    },
                    {
                        id: 3,
                        name: 'Открой свой внутренний мир',
                        description: 'Знакомься, общайся, находи новых друзей вместе с нами'
                    },
                    {
                        id: 4,
                        name: 'Покажи друзьям свои путешествия',
                        description: 'Даже если друзья далеко, sviazik поможет поделиться красивыми моментами'
                    },
                    {
                        id: 5,
                        name: 'Поддержи хвостиков и котиков',
                        description: 'Имей возможность общаться с друзьями из любой точки мира'
                    },

                ]
            }
        },
        {
            name: 'en',
            words: {
                Settings: 'Settings',
                Search: 'Search',
                TypeMessage: 'Type a message',
                Send: 'Send',
                SecretMessage: 'Secure message',
                PlannedMesssage: 'Planned message(soon)',
                Username: 'Username',
                Edit: 'Edit',
                SelectAppLanguage: 'Select app language',
                SelectAppTheme: 'Select app theme',
                UploadBackground: 'Here you can upload your own backgroun image(soon)',
                LogOut: 'Log out',
                Close: 'Close',
                Apply: 'Apply',
                CreateRoom: 'Create new room',
                RoomName: 'Enter room name',
                RoomDescription: 'Enter room decription',
                Create: 'Create',
                OtherProducts: 'Other products',
                Tagline: `Always be in touch with your loved ones with `,
                LittleTagline: 'We are constantly improving the quality of the services provided',
                OpenSviazik: 'Open web-sviazik',
                Download: 'Download sviazik',
                Email: 'Email',
                EnterEmail: 'Enter email',
                Password: 'Password',
                EnterPassword: 'Enter password',
                LogIn: 'Log in',
                CreateAccount: 'Create account',
                RepeatPassword: 'Confirm password',
                SubscribeUpdates: 'Subcribe on updates?',
                Register: 'Register',
                AlreadyAccount: 'Already have an account?',
                EnterUsername: 'Enter username',
                EmailWillUse: 'Email will be used to log into your account',
                ThirdPersons: 'We do not share your mail with 3 persons',
                Delete: 'Delete',
                Scream: 'Cry from the heart',
                Users:'List of users:',
                ShareString:'Share string: ',
                Description:'Описание',
                SearchUser:'Search by username',
                Sure:'Are you sure?',
                Deleted:'Deleted',
                Canceled:'Canceled',
                Copy:'Copy',
                CopySucsess:'Copy sucsess',
                CardInfo: [
                    {
                        id: 0,
                        name: 'Stay Connected',
                        description: 'Be able to communicate with friends from anywhere in the world'
                    },
                    {
                        id: 1,
                        name: 'Servers never fail',
                        description: 'Sviazik has servers all over the world ready to process your call at any time'
                    },
                    {
                        id: 2,
                        name: 'Never get lost',
                        description: `Even if you find yourself in a difficult situation, don't forget to call your dog`
                    },
                    {
                        id: 3,
                        name: 'Explore your inner world',
                        description: 'Meet new people, communicate, and make new friends with us'
                    },
                    {
                        id: 4,
                        name: 'Show your travels to friends',
                        description: 'Even if your friends are far away, sviazik will help you share beautiful moments'
                    },
                    {
                        id: 5,
                        name: 'Support Tails and Cats',
                        description: 'Be able to communicate with friends from anywhere in the world'
                    }
                ]
            }
        },
    ]
