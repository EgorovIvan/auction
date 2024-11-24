import React from 'react';
import './Error404.scss';

const Error404: React.FC = () => {
    return (
        <div className="error-404">
            <div className="error-404__content">
                <h1 className="error-404__title">404</h1>
                <p className="error-404__message">Page not found</p>
                <a href="/" className="error-404__link">Go back to Home</a>
            </div>
        </div>
    );
};

export default Error404;
