import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../axios-client";

export default function PlayerForm() {

    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState(null);

    const { id } = useParams();
    const [player, setPlayer] = useState({
        id: null,
        name: '',
        ability: 0,
        is_goal_keeper: false
    });

    useEffect(() => { 
        if (id) {
            getPlayer(id);
        } else {
            setLoading(false);
        }
    }, []);

    const getPlayer = (id) => {
        setLoading(true);
        axiosClient.get('/players/' + id).then(({data}) => {
            setPlayer(data);
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        })
    }

    const onSubmit = (ev) => {
        ev.preventDefault();
        setErrors(null);
        setLoading(true);

        if (player.id) {
            updatePlayer();
        } else {
            createPlayer();
        }
    }

    const createPlayer = () => {
        axiosClient.post('/players', player).then(({data}) => {
            setPlayer(data);
            setLoading(false);
        }).catch((error) => {
            const response = error.response;
            if (response && response.status == 422) {
                if (response.data.errors) {
                    const errors = [];
                    Object.keys(response.data.errors).forEach(key => {
                        errors.push(response.data.errors[key]);
                    });
                    setErrors(errors);
                }
            }
            setLoading(false);
        })
    }

    const updatePlayer = () => {
        axiosClient.put('/players/' + player.id, player).then(({data}) => {
            setPlayer(data);
            setLoading(false);
        }).catch((error) => {
            const response = error.response;
            if (response && response.status == 422) {
                if (response.data.errors) {
                    const errors = [];
                    Object.keys(response.data.errors).forEach(key => {
                        errors.push(response.data.errors[key]);
                    });
                    setErrors(errors);
                } else if (response.data.message) {
                    setErrors(response.data.message)
                }
            }
            setLoading(false);
        })
    }

    return(
        <div>
            <div className="page-title">
                {player.id && <h1>Updating Player: {player.name}</h1>}
                {!player.id && <h1>New Player</h1>}
            </div>
            {loading && <div className="text-center"><h2>Loading...</h2></div>}
            {!loading &&
                <div style={{ justifyContent: 'center', display: 'grid' }}>
                    { errors && <div className="alert">
                        {Object.keys(errors).map(key => (
                            <p key={key}>{errors[key]}</p>
                        ))}
                    </div>
                    }
                    <form onSubmit={onSubmit} className="player-form">
                        <input value={player.name} onChange={ev => setPlayer({...player, name: ev.target.value})} type="text" placeholder="Player Name"/>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <h4>Ability:</h4>
                            <label>
                                <select value={player.ability} onChange={ev => setPlayer({...player, ability: ev.target.value})}>
                                    <option value="0">Select</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                            </label>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBlock: '14px' }}>
                            <h4>Goalkeeper:</h4>
                            <label className="switch">
                                <input checked={player.is_goal_keeper} onChange={ev => setPlayer({...player, is_goal_keeper: ev.target.checked})} type="checkbox"/>
                                <span className="slider round"></span>
                            </label>
                        </div>
                        <button className="btn btn-add btn-block">Send</button>
                    </form>
                </div>
            }
        </div>
    )
}