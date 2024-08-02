import React from 'react';
import './style.css';

const Header = ({children}: any) => {
    return (
        <div className="header">
            <div className="title-area">
                <div className="header-title">
                    Students hub
                </div>
                <div className="header-subtitle">
                    Pesquise, adicione, edite e delete alunos no sistema.
                </div>
            </div>
            <div className="header-inputs-area">
                {children}
            </div>
        </div>
    )
}

export default Header;