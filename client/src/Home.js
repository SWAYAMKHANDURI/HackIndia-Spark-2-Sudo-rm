import React from 'react';
import { useHistory } from "react-router-dom";
import './Home.css'; // Make sure to create this CSS file for styling

function Home() {
    const history = useHistory();
    
    const redirect_to_roles = () => {
        history.push('/roles');
    };

    const redirect_to_addmed = () => {
        history.push('/addmed');
    };

    const redirect_to_supply = () => {
        history.push('/supply');
    };

    const redirect_to_track = () => {
        history.push('/track');
    };

    return (
        <div className="home-container">
            <nav className="navbar">
                <div className="navbar-brand">SupplyChainDapp</div>
                <button className="connect-wallet-btn">Connect Wallet</button>
            </nav>
            <section className="hero-section">
                <h1 className="hero-heading">Pharmaceutical Supply Chain Management</h1>
            </section>
            <div className="content">
                <h3>Pharmaceutical Supply Chain Flow :- </h3>
                <br />
                <h6>(Note: Here <u>Owner</u> is the person who deployed the smart contract on the blockchain)</h6>
                <h5>Step 1: Owner Should Register Raw material suppliers, Manufacturers, Distributors, and Retailers</h5>
                <h6>(Note: This is a one-time step. Skip to step 2 if already done)</h6>
                <button onClick={redirect_to_roles} className="btn btn-outline-primary btn-sm">Register</button>
                <br />
                <h5>Step 2: Owner should order medicines</h5>
                <button onClick={redirect_to_addmed} className="btn btn-outline-primary btn-sm">Order Medicines</button>
                <br />
                <h5>Step 3: Control Supply Chain</h5>
                <button onClick={redirect_to_supply} className="btn btn-outline-primary btn-sm">Control Supply Chain</button>
                <br />
                <hr />
                <br />
                <h5><b>Track</b> the medicines:</h5>
                <button onClick={redirect_to_track} className="btn btn-outline-primary btn-sm">Track Medicines</button>
            </div>
        </div>
    );
}

export default Home;
