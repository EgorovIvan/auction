import eslint from "eslint";
import react from "eslint-plugin-react";
import typescript from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";

export default [
    {
        files: ["**/*.{ts,tsx,js,jsx}"], // Файлы, которые нужно проверять
        languageOptions: {
            parser: parser, // Парсер для TypeScript
            parserOptions: {
                ecmaVersion: 2021,
                sourceType: "module",
                ecmaFeatures: {
                    jsx: true, // Поддержка JSX
                },
            },
        },
        plugins: {
            "@typescript-eslint": typescript,
            react,
        },
        settings: {
            react: {
                version: "detect", // Автоматическое определение версии React
            },
        },
        rules: {
            // Базовые правила ESLint
            "no-unused-vars": "warn",
            "no-console": "warn",

            // React
            "react/react-in-jsx-scope": "off", // Не нужно импортировать React в новом JSX
            "react/prop-types": "off", // Выключаем prop-types для TypeScript

            // TypeScript
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],

            // Prettier (совместимость с форматированием)
            ...prettier.rules,
        },
    },
];
