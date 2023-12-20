import { useEffect, useRef, useState } from "react";
import axiosClient from "../axios-client";

export default function Draw() {

    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState(null);

    const [players, setPlayers] = useState([]);
    const [playersPresent, setPlayersPresent] = useState([]);
    const [teams, setTeams] = useState(null);

    const playersPerTeamRef = useRef();
    const isSelectedAll = playersPresent.length === players.length;

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

    const setPlayerPresence = (player) => {
        if (playersPresent.includes(player)) {
            const newPlayers = playersPresent.filter(p => p !== player);
            setPlayersPresent(newPlayers);
        } else {
            setPlayersPresent([...playersPresent, player]);
        }
    }

    const onDrawTeams = () => {
        setLoading(true);
        setErrors(null);

        const payload = {
            players: players.filter(p => playersPresent.includes(p.id)),
            players_per_team: playersPerTeamRef.current.value
        };

        axiosClient.post('/draw-teams', payload).then(({data}) => {
            setTeams(data);
            setLoading(false);
        }).catch((error) => {
            const response = error.response;
            if (response && response.status == 422) {
                if (response.data.message) {
                    setErrors([response.data.message])
                }
            }
            setLoading(false);
        });
    }

    const onRemake = () => {
        setTeams(null);
        setPlayersPresent([]);
        getPlayers();
    }

    const onSelectAll = () => {
        if (isSelectedAll) {
            setPlayersPresent([]);
        } else {
            const selectedPlayers = players.map(player => (
                player.id
            ));
            
            setPlayersPresent(selectedPlayers);
        }
    }

    return (
        <div>
            <div className="page-title">
                <h1 style={{ whiteSpace: "nowrap" }}>Draw Teams</h1>
                {!teams && <div style={{  display: 'flex', alignItems: 'center', width: '100%', marginRight: '13%', justifyContent:"space-between"}}>
                    <div style={{  display: 'flex', alignItems: 'center'}}>
                        <p>Players per team:</p>
                        <input min="1" defaultValue="1" style={{ width: '50px', height: '32px',marginBottom: 0, marginInline: '10px', padding: 0, textAlign: 'center' }} ref={playersPerTeamRef} type="number" />
                        <button onClick={onDrawTeams} className="btn btn-add">DRAW</button>
                    </div>
                    {!isSelectedAll && <button onClick={onSelectAll} className="btn btn-add" style={{ marginInline: '10px' }}>Select all</button>}
                    {isSelectedAll && <button onClick={onSelectAll} className="btn btn-delete" style={{ marginInline: '10px' }}>Unselect all</button>}
                </div>}
                {teams && <div style={{  display: 'flex', alignItems: "center" }}>
                    <button onClick={onRemake} className="btn btn-delete">Remake</button>
                </div>}
            </div>
            {!teams && <div>
                { errors && <div className="alert" style={{ display: "flex", marginBlock: '16px', marginInline: '13%' }}>
                    {Object.keys(errors).map(key => (
                        <p key={key}>{errors[key]}</p>
                    ))}
                </div>
                }
                <div className="card animated fadeInDown" style={{ display: 'flex', justifyContent: 'center' }}>
                    <table style={{ maxWidth: '75%' }}>
                        <thead>
                            <tr>
                                <th id="nameColumn">Name</th>
                                <th id="abilityColumn">Ability</th>
                                <th id="goalkeeperColumn">Is Goalkeeper</th>
                                <th id="actionsColumn">Presence</th>
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
                                        {playersPresent.includes(p.id) && <button onClick={ev => setPlayerPresence(p.id)} className="btn btn-add">Present</button>}
                                        {!playersPresent.includes(p.id) && <button onClick={ev => setPlayerPresence(p.id)} className="btn btn-delete">Not Present</button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>}
                    </table>
                </div>
            </div>
            }
            {teams && <div className="card animated fadeInDown" style={{ display: 'flex', justifyContent: 'center' }}>
                {Object.keys(teams).map(key => (
                    <div id={'Team' + key} style={{ display: "block", textAlign: "left", justifyContent: "start", alignItems: 'start'}}>
                        <h2>Team {key}</h2>
                        <table style={{ maxWidth: '75%' }}>
                        <thead>
                            <tr>
                                <th id="nameColumn">Name</th>
                                <th id="abilityColumn">Ability</th>
                                <th id="goalkeeperColumn">Is Goalkeeper</th>
                            </tr>
                        </thead>
                        {!loading && <tbody>
                            {teams[key].map(p => (
                                <tr key={p.id} className="table-player-row">
                                    <td id="nameColumn">{p.name}</td>
                                    <td>{p.ability}</td>
                                    <td>{p.is_goal_keeper ? 'Yes' : 'No'}</td>
                                </tr>
                            ))}
                        </tbody>}
                    </table>
                    </div>
                ))}
            </div>
            }
        </div>
    )
}