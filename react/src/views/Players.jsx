import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axiosClient from "../axios-client";

export default function Players() {

    const [loading, setLoading] = useState(null);
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        getPlayers()
    }, [])

    const getPlayers = () => {
        setLoading(true);
        axiosClient.get('/players').then(({data}) => {
            setPlayers(data);
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }

    const updatePlayer = (id) => {
        <Navigate to={"/players/" + id}/>
    }
    
    const deletePlayer = (p) => {
        if (window.confirm('Do you really want to delete player ' + p.name + ' ?')) {
            setLoading(true)
            axiosClient.delete('/players/' + p.id).then(() => {
                getPlayers();
            }).catch(() => {
                setLoading(true);
            })
        }
    }
    
    return(
        <div>
            <div className="page-title">
                <h1>Players</h1>
                <Link to="/players/create" className="btn btn-add">Add Player</Link>
            </div>
            <div className="card animated fadeInDown" style={{ display: 'flex', justifyContent: 'center' }}>
                <table>
                    <thead>
                        <tr>
                            <th id="nameColumn">Name</th>
                            <th id="abilityColumn">Ability</th>
                            <th id="goalkeeperColumn">Is Goalkeeper</th>
                            <th id="actionsColumn">Actions</th>
                        </tr>
                    </thead>
                    {loading && <tbody>
                        <tr>
                            <td colSpan="4" className="text-center"><h2>Loading...</h2></td>
                        </tr>
                    </tbody>}
                    {!loading && <tbody>
                        {players.map(p => (
                            <tr key={p.id} className="table-player-row">
                                <td id="nameColumn">{p.name}</td>
                                <td>{p.ability}</td>
                                <td>{p.is_goal_keeper ? 'Yes' : 'No'}</td>
                                <td>
                                    <Link to={"/players/" + p.id} className="btn btn-edit" style={{ marginInline: '10px' }}>Edit</Link>
                                    <button onClick={ev => deletePlayer(p)} className="btn btn-delete" style={{ marginInline: '10px' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>}
                </table>
            </div>
        </div>
    )
}