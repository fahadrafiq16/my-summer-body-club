import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getBackendBaseUrl } from '../../utils/backend';
import './MongoDbStatusIndicator.css';

const POLL_MS = 30000;

export default function MongoDbStatusIndicator() {
    const [connected, setConnected] = useState(null);

    useEffect(() => {
        let cancelled = false;

        const check = async () => {
            try {
                const res = await axios.get(`${getBackendBaseUrl()}/api/health`, { timeout: 10000 });
                if (cancelled) return;
                const data = res?.data || {};
                const ok =
                    data.connected === true &&
                    (data.success === true || data.functional === true || data.pingOk === true);
                setConnected(ok);
            } catch {
                if (!cancelled) setConnected(false);
            }
        };

        check();
        const intervalId = setInterval(check, POLL_MS);
        return () => {
            cancelled = true;
            clearInterval(intervalId);
        };
    }, []);

    const isConnected = connected === true;
    const label = connected === null
        ? 'MongoDB status checking…'
        : isConnected
            ? 'MongoDB connected'
            : 'MongoDB disconnected';

    return (
        <div
            className={`mongo-status-indicator ${isConnected ? 'mongo-status-indicator--green' : 'mongo-status-indicator--red'}`}
            role="status"
            aria-live="polite"
            aria-label={label}
            title={label}
        />
    );
}
