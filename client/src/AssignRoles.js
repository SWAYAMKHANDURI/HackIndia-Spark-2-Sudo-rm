import React, { useState, useEffect } from 'react';
import Web3 from "web3";
import SupplyChainABI from "./artifacts/SupplyChain.json";
import { useHistory } from "react-router-dom";
import './AssignRoles.css'; 

function AssignRoles() {
    const history = useHistory();
    const [currentAccount, setCurrentAccount] = useState("");
    const [loader, setLoader] = useState(true);
    const [SupplyChain, setSupplyChain] = useState();
    const [roles, setRoles] = useState({
        RMS: [], MAN: [], DIS: [], RET: []
    });
    const [form, setForm] = useState({
        RMS: { name: '', place: '', address: '' },
        MAN: { name: '', place: '', address: '' },
        DIS: { name: '', place: '', address: '' },
        RET: { name: '', place: '', address: '' }
    });

    useEffect(() => {
        loadWeb3();
        loadBlockchainData();
    }, []);

    const loadWeb3 = async () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            alert("Non-Ethereum browser detected. You should consider trying MetaMask!");
        }
    };

    const loadBlockchainData = async () => {
        setLoader(true);
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
        setCurrentAccount(account);

        const networkId = await web3.eth.net.getId();
        const networkData = SupplyChainABI.networks[networkId];

        if (networkData) {
            const supplyChain = new web3.eth.Contract(SupplyChainABI.abi, networkData.address);
            setSupplyChain(supplyChain);

            const roles = {};
            const types = ['RMS', 'MAN', 'DIS', 'RET'];
            for (const type of types) {
                const ctr = await supplyChain.methods[`${type.toLowerCase()}Ctr`]().call();
                const data = {};
                for (let i = 0; i < ctr; i++) {
                    data[i] = await supplyChain.methods[type.toLowerCase()](i + 1).call();
                }
                roles[type] = data;
            }

            setRoles(roles);
            setLoader(false);
        } else {
            alert('The smart contract is not deployed to the current network');
        }
    };

    const handleInputChange = (role, field) => (event) => {
        setForm({
            ...form,
            [role]: {
                ...form[role],
                [field]: event.target.value
            }
        });
    };

    const handleSubmit = async (role) => async (event) => {
        event.preventDefault();
        try {
            const method = `add${role}`;
            const receipt = await SupplyChain.methods[method](
                form[role].address,
                form[role].name,
                form[role].place
            ).send({ from: currentAccount });

            if (receipt) {
                loadBlockchainData();
            }
        } catch (err) {
            alert("An error occurred!");
        }
    };

    if (loader) {
        return <div className="loading">Loading...</div>;
    }

    const redirectToHome = () => {
        history.push('/');
    };

    const renderTable = (role) => (
        <table className="table table-sm">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Place</th>
                    <th>Ethereum Address</th>
                </tr>
            </thead>
            <tbody>
                {Object.keys(roles[role]).map(key => (
                    <tr key={key}>
                        <td>{roles[role][key].id}</td>
                        <td>{roles[role][key].name}</td>
                        <td>{roles[role][key].place}</td>
                        <td>{roles[role][key].addr}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <div className="assign-roles">
            <div className="header">
                <span><b>Current Account Address:</b> {currentAccount}</span>
                <button onClick={redirectToHome} className="btn btn-outline-danger btn-sm">HOME</button>
            </div>

            {['RMS', 'MAN', 'DIS', 'RET'].map(role => (
                <div key={role} className="role-section">
                    <h4>{role === 'RMS' ? 'Raw Material Suppliers' : role + 's'}:</h4>
                    <form onSubmit={handleSubmit(role)}>
                        <input 
                            className="form-control-sm" 
                            type="text" 
                            onChange={handleInputChange(role, 'address')} 
                            placeholder="Ethereum Address" 
                            required 
                        />
                        <input 
                            className="form-control-sm" 
                            type="text" 
                            onChange={handleInputChange(role, 'name')} 
                            placeholder={`${role} Name`} 
                            required 
                        />
                        <input 
                            className="form-control-sm" 
                            type="text" 
                            onChange={handleInputChange(role, 'place')} 
                            placeholder="Based In" 
                            required 
                        />
                        <button className="btn btn-outline-success btn-sm" type="submit">Register</button>
                    </form>
                    {renderTable(role)}
                </div>
            ))}
        </div>
    );
}

export default AssignRoles;
