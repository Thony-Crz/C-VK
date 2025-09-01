import React, { useMemo, useState } from 'react';
import { estimateCourse } from '../estimator';
import type { Format } from '../core';
import type { Categorie, Sexe } from '../minimas';

function toMinutesDisplay(min: number) {
  const total = Math.round(min);
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${h}h${String(m).padStart(2, '0')}`;
}

export const App: React.FC = () => {
  const [distanceKm, setDistanceKm] = useState('42');
  const [dPlusM, setDPlusM] = useState('2000');
  const [sexe, setSexe] = useState<Sexe>('H');
  const [categorie, setCategorie] = useState<Categorie>('SE');
  const [seasonId, setSeasonId] = useState('2025/26');
  const [requestedFormat, setRequestedFormat] = useState<Format | 'auto'>('auto');

  const parsed = useMemo(() => {
    const d = parseFloat(distanceKm);
    const dp = parseFloat(dPlusM);
    return { d, dp };
  }, [distanceKm, dPlusM]);

  const estimation = useMemo(() => {
    if (!Number.isFinite(parsed.d) || parsed.d <= 0 || !Number.isFinite(parsed.dp) || parsed.dp < 0) {
      return null;
    }
    return estimateCourse({
      distanceKm: parsed.d,
      dPlusM: parsed.dp,
      sexe,
      categorie,
      seasonId,
      requestedFormat,
    });
  }, [parsed, sexe, categorie, seasonId, requestedFormat]);

  return (
    <div className="page">
      <div className="card">
        <h2 className="title">Qualif Trail – Estimation</h2>
        <p className="subtitle">Calcule l’allure/temps cible à tenir selon les minimas FFA.</p>

        <div className="row grid2">
          <div>
            <label>Distance (km)</label>
            <input value={distanceKm} onChange={(e) => setDistanceKm(e.target.value)} inputMode="decimal" />
          </div>
          <div>
            <label>D+ (m)</label>
            <input value={dPlusM} onChange={(e) => setDPlusM(e.target.value)} inputMode="numeric" />
          </div>
        </div>

        <div className="row grid2">
          <div>
            <label>Sexe</label>
            <select value={sexe} onChange={(e) => setSexe(e.target.value as Sexe)}>
              <option value="H">H</option>
              <option value="F">F</option>
            </select>
          </div>
          <div>
            <label>Catégorie</label>
            <select value={categorie} onChange={(e) => setCategorie(e.target.value as Categorie)}>
              {['ES','SE','M0','M1','M2','M3','M4','M5','M6','M7','M8','M9','M10'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="row grid2">
          <div>
            <label>Saison</label>
            <select value={seasonId} onChange={(e) => setSeasonId(e.target.value)}>
              <option value="2025/26">2025/26</option>
            </select>
          </div>
          <div>
            <label>Format visé</label>
            <select value={requestedFormat} onChange={(e) => setRequestedFormat(e.target.value as any)}>
              <option value="auto">Auto</option>
              <option value="court">Court</option>
              <option value="long">Long</option>
            </select>
          </div>
        </div>

        <div className="actions">
          <button className="btn primary" onClick={() => { /* recalcul automatique via useMemo */ }}>Estimer</button>
          {estimation && (
            estimation.eligibleParcours ? (
              <span className="pill good">Parcours éligible (≥ 30 km-effort)</span>
            ) : (
              <span className="pill bad">Non éligible &lt; 30 km-effort</span>
            )
          )}
        </div>

        {estimation && (
          <div className="result">
            <div className="row grid2">
              <div>
                <div className="muted">Km-effort</div>
                <div>{estimation.kmEffort.toFixed(2)}</div>
              </div>
              <div>
                <div className="muted">Format imposé</div>
                <div className="pill" style={{border:'1px solid rgba(255,255,255,0.2)'}}>{estimation.formatCalcule}</div>
              </div>
            </div>

            {estimation.requiresFinishOnly ? (
              <div className="row">
                <div className="muted">Objectif</div>
                <div>Cat. {categorie}: terminer une course labellisée (format {estimation.formatCalcule}).</div>
              </div>
            ) : (
              <>
                <div className="row grid2">
                  <div>
                    <div className="muted">VK cible (min/km)</div>
                    <div>{estimation.vkCibleMinPerKm?.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="muted">Vitesse moy. (km/h)</div>
                    <div>{estimation.vitesseMoyKmH?.toFixed(2)}</div>
                  </div>
                </div>
                <div className="row">
                  <div className="muted">Temps cible</div>
                  <div>
                    {estimation.tempsCibleMinutes != null ? (
                      <>
                        <strong>{toMinutesDisplay(estimation.tempsCibleMinutes)}</strong>
                        <span className="muted"> (±1–3%)</span>
                        <div className="muted" style={{marginTop:6}}>
                          {estimation.tempsAvecMargeMinutes.map(({pct,min,max}) => (
                            <div key={pct}>±{Math.round(pct*100)}%: {min?toMinutesDisplay(min):'-'} → {max?toMinutesDisplay(max):'-'}</div>
                          ))}
                        </div>
                      </>
                    ) : '-'}
                  </div>
                </div>
              </>
            )}

            {estimation.warnings.length > 0 && (
              <div className="row" style={{marginTop:10}}>
                {estimation.warnings.map((w, i) => (
                  <div key={i} className="pill warn" style={{display:'block', marginBottom:6}}>{w}</div>
                ))}
              </div>
            )}

            <div className="row" style={{marginTop:10}}>
              <div className="muted">
                Rappel: qualification sur courses labellisées FFA, calcul basé sur km‑effort et minimas FFA.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

