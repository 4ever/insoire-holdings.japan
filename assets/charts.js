/* ============================================
   Inspire Holdings - Chart.js visualizations
   Loaded after Chart.js (deferred)
   ============================================ */
(function(){
  'use strict';

  // Wait for Chart.js to be available
  function ready(cb){
    if(typeof Chart !== 'undefined') return cb();
    setTimeout(function(){ ready(cb); }, 50);
  }

  // Lazy-init: only create chart when its card scrolls into view
  function lazyChart(id, builder){
    var el = document.getElementById(id);
    if(!el) return;
    if(!('IntersectionObserver' in window)){ builder(el); return; }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          builder(el);
          io.unobserve(e.target);
        }
      });
    }, {rootMargin:'120px'});
    io.observe(el);
  }

  ready(function(){
    // Brand-aligned palette
    var GOLD   = '#b8945a';
    var GOLD_D = '#8b6f3e';
    var NAVY   = '#1a2332';
    var NAVY_S = '#2a3a52';
    var WARM   = '#c9a96e';
    var TAUPE  = '#7a6a52';

    Chart.defaults.color = '#6c6c6c';
    Chart.defaults.font.family = "'Noto Sans JP','sans-serif'";
    Chart.defaults.font.size = 10;
    Chart.defaults.borderColor = 'rgba(0,0,0,0.06)';

    var grid = {color:'rgba(0,0,0,0.05)', drawBorder:false};

    lazyChart('growthChart', function(el){
      new Chart(el, {
        type:'line',
        data:{
          labels:['2021','2022','2023','2024','2025','2026'],
          datasets:[
            {label:'Business Related', data:[100,140,190,250,320,400],
              borderColor:NAVY, backgroundColor:'rgba(26,35,50,0.08)',
              tension:0.4, fill:true, borderWidth:2, pointRadius:3, pointHoverRadius:6, pointBackgroundColor:NAVY},
            {label:'General Support', data:[80,110,160,210,290,360],
              borderColor:GOLD, backgroundColor:'rgba(184,148,90,0.12)',
              tension:0.4, fill:true, borderWidth:2, pointRadius:3, pointHoverRadius:6, pointBackgroundColor:GOLD},
            {label:'E-Commerce', data:[40,90,170,260,380,520],
              borderColor:TAUPE, backgroundColor:'rgba(122,106,82,0.08)',
              tension:0.4, fill:true, borderWidth:2, pointRadius:3, pointHoverRadius:6, pointBackgroundColor:TAUPE}
          ]
        },
        options:{
          responsive:true, maintainAspectRatio:false,
          plugins:{legend:{position:'bottom', labels:{usePointStyle:true, padding:14, font:{size:11}}}},
          scales:{x:{grid:{display:false}}, y:{grid:grid, beginAtZero:true}}
        }
      });
    });

    lazyChart('pieChart', function(el){
      new Chart(el, {
        type:'doughnut',
        data:{
          labels:['E-Commerce','Business Consulting','IT/System','Real Estate','Other'],
          datasets:[{
            data:[38,24,18,14,6],
            backgroundColor:[GOLD, NAVY, WARM, NAVY_S, '#d4c4a4'],
            borderColor:'#fff', borderWidth:3
          }]
        },
        options:{
          responsive:true, maintainAspectRatio:false, cutout:'68%',
          plugins:{legend:{position:'right', labels:{usePointStyle:true, padding:12, font:{size:11}}}}
        }
      });
    });

    var isEN = (document.documentElement.lang || 'ja').toLowerCase().indexOf('en') === 0;
    var L = {
      bizSteps : isEN ? ['Research','Strategy','Incorporation','Team Build','Operation'] : ['市場調査','戦略策定','法人設立','チーム構築','本格運用'],
      bizLabel : isEN ? 'Success Rate %' : '成功確率 %',
      radarAxes: isEN ? ['Availability','Performance','Security','Scalability','Maintainability','Cost'] : ['可用性','パフォーマンス','セキュリティ','拡張性','保守性','コスト'],
      radarA   : isEN ? 'Current' : '現在',
      radarB   : isEN ? 'Target' : '目標'
    };

    lazyChart('businessChart', function(el){
      new Chart(el, {
        type:'bar',
        data:{
          labels:L.bizSteps,
          datasets:[{
            label:L.bizLabel,
            data:[95,88,92,78,85],
            backgroundColor:[GOLD, GOLD, NAVY, WARM, GOLD_D],
            borderRadius:3, borderWidth:0
          }]
        },
        options:{
          responsive:true, maintainAspectRatio:false,
          plugins:{legend:{display:false}},
          scales:{
            x:{grid:{display:false}},
            y:{grid:grid, beginAtZero:true, max:100, ticks:{callback:function(v){return v+'%';}}}
          }
        }
      });
    });

    lazyChart('generalChart', function(el){
      new Chart(el, {
        type:'radar',
        data:{
          labels:L.radarAxes,
          datasets:[{
            label:L.radarA, data:[99,92,96,88,94,90],
            borderColor:GOLD, backgroundColor:'rgba(184,148,90,0.18)',
            pointBackgroundColor:GOLD, pointRadius:3
          },{
            label:L.radarB, data:[100,95,98,95,95,92],
            borderColor:NAVY, backgroundColor:'transparent',
            borderDash:[4,4], pointBackgroundColor:NAVY, pointRadius:3
          }]
        },
        options:{
          responsive:true, maintainAspectRatio:false,
          plugins:{legend:{position:'bottom', labels:{usePointStyle:true, font:{size:10}}}},
          scales:{r:{
            angleLines:{color:'rgba(0,0,0,0.08)'},
            grid:{color:'rgba(0,0,0,0.06)'},
            pointLabels:{font:{size:10}},
            ticks:{display:false},
            suggestedMin:60, suggestedMax:100
          }}
        }
      });
    });

    // JSON からデータを取得してグラフを描画（en/ サブディレクトリからも動作）
    // sessionStorage にキャッシュして同一セッション内の再フェッチを防ぐ
    var DATA_URL = (document.documentElement.lang === 'en' ? '../' : '') + 'assets/data/charts-data.json';
    var CACHE_KEY = 'ihi_charts_v3';
    function renderWithData(d){
        lazyChart('phAgeChart', function(el){
          var ag = d.phAge;
          new Chart(el, {
            type:'bar',
            data:{
              labels: isEN ? ag.labelsEN : ag.labels,
              datasets:[{
                label: isEN ? 'Population %' : '人口比率 %',
                data: ag.data,
                backgroundColor:[NAVY,NAVY_S,GOLD,GOLD_D,WARM,TAUPE,'#d4c4a4'],
                borderRadius:3, borderWidth:0
              }]
            },
            options:{
              indexAxis:'y', responsive:true, maintainAspectRatio:false,
              plugins:{
                legend:{display:false},
                tooltip:{callbacks:{label:function(c){return c.parsed.x+'%';}}}
              },
              scales:{
                x:{grid:grid, beginAtZero:true, max:35,
                  ticks:{callback:function(v){return v+'%';}}},
                y:{grid:{display:false}, ticks:{font:{size:10}}}
              }
            }
          });
        });

        lazyChart('phGDPChart', function(el){
          var gd = d.phGDP;
          var colors = gd.data.map(function(v){
            return v < 0 ? '#c0392b' : (v >= 7 ? GOLD : NAVY_S);
          });
          new Chart(el, {
            type:'bar',
            data:{
              labels: gd.labels,
              datasets:[{
                label: isEN ? 'Real GDP Growth %' : '実質GDP成長率 %',
                data: gd.data,
                backgroundColor: colors,
                borderRadius:3, borderWidth:0
              }]
            },
            options:{
              responsive:true, maintainAspectRatio:false,
              plugins:{
                legend:{display:false},
                tooltip:{callbacks:{label:function(c){return c.parsed.y+'%';}}}
              },
              scales:{
                x:{grid:{display:false}},
                y:{grid:grid, ticks:{callback:function(v){return v+'%';}}}
              }
            }
          });
        });

        lazyChart('jpCompaniesChart', function(el){
          var jp = d.jpCompanies;
          var colors = jp.data.map(function(_,i){
            return (i >= jp.data.length - 2) ? GOLD : TAUPE;
          });
          new Chart(el, {
            type:'bar',
            data:{
              labels: jp.labels,
              datasets:[{
                label:'日系進出企業数（社）',
                data: jp.data,
                backgroundColor: colors,
                borderRadius:3, borderWidth:0
              }]
            },
            options:{
              responsive:true, maintainAspectRatio:false,
              plugins:{
                legend:{display:false},
                tooltip:{callbacks:{label:function(c){return c.parsed.y.toLocaleString()+'社';}}}
              },
              scales:{
                x:{grid:{display:false}},
                y:{grid:grid, beginAtZero:false,
                  min: Math.floor(Math.min.apply(null, jp.data) * 0.95 / 100) * 100,
                  ticks:{callback:function(v){return v.toLocaleString();}}}
              }
            }
          });
        });

        lazyChart('pezaChart', function(el){
          var pz = d.peza;
          new Chart(el, {
            data:{
              labels: pz.labels,
              datasets:[{
                type:'bar', label:'PEZA登録外資系企業数（社）',
                data: pz.registered,
                backgroundColor:'rgba(184,148,90,0.55)', borderRadius:3, borderWidth:0, order:2
              },{
                type:'line', label:'前年比増加数',
                data: pz.yoyIncrease,
                borderColor:NAVY, backgroundColor:'transparent',
                tension:0.4, borderWidth:2, pointRadius:3, pointBackgroundColor:NAVY,
                yAxisID:'y1', order:1
              }]
            },
            options:{
              responsive:true, maintainAspectRatio:false,
              plugins:{
                legend:{position:'bottom', labels:{usePointStyle:true, font:{size:10}}},
                tooltip:{callbacks:{
                  label:function(c){
                    return c.dataset.label+': '+(c.parsed.y!==null ? c.parsed.y.toLocaleString()+(c.dataset.yAxisID==='y1'?'社増':'社') : '—');
                  }
                }}
              },
              scales:{
                x:{grid:{display:false}},
                y:{grid:grid, beginAtZero:false,
                  min: Math.floor(Math.min.apply(null, pz.registered) * 0.95 / 100) * 100,
                  ticks:{callback:function(v){return v.toLocaleString();}}},
                y1:{position:'right', grid:{display:false}, beginAtZero:true,
                  ticks:{callback:function(v){return '+'+v;}}}
              }
            }
          });
        });

        lazyChart('phFDIChart', function(el){
          var fd = d.phFDI;
          var colors = fd.data.map(function(_,i){
            return (i >= fd.data.length - 2) ? GOLD : TAUPE;
          });
          new Chart(el, {
            type:'bar',
            data:{
              labels: fd.labels,
              datasets:[{
                label: isEN ? 'FDI Net Inflows (USD 100M)' : 'FDI純流入（億USD）',
                data: fd.data,
                backgroundColor: colors,
                borderRadius:3, borderWidth:0
              }]
            },
            options:{
              responsive:true, maintainAspectRatio:false,
              plugins:{
                legend:{display:false},
                tooltip:{callbacks:{label:function(c){return c.parsed.y+(isEN?' B USD':'億USD');}}}
              },
              scales:{
                x:{grid:{display:false}},
                y:{grid:grid, beginAtZero:false,
                  min: Math.floor(Math.min.apply(null, fd.data) * 0.85 / 10) * 10,
                  ticks:{callback:function(v){return v+(isEN ? 'B' : '億');}}}
              }
            }
          });
        });

        lazyChart('phFDIByCountryChart', function(el){
          var fc = d.phFDIByCountry;
          new Chart(el, {
            type:'doughnut',
            data:{
              labels: isEN ? fc.labelsEN : fc.labels,
              datasets:[{
                data: fc.data,
                backgroundColor:[NAVY, GOLD, WARM, NAVY_S, TAUPE, '#d4c4a4'],
                borderColor:'#fff', borderWidth:3
              }]
            },
            options:{
              responsive:true, maintainAspectRatio:false, cutout:'62%',
              plugins:{
                legend:{position:'right', labels:{usePointStyle:true, padding:10, font:{size:10}}},
                tooltip:{callbacks:{label:function(c){return c.label+': '+c.parsed+'%';}}}
              }
            }
          });
        });

        lazyChart('phRegionsChart', function(el){
          var rg = d.phRegions;
          var lbl = isEN ? rg.labelsEN : rg.labels;
          new Chart(el, {
            type:'bar',
            data:{
              labels: lbl,
              datasets:[
                {label: isEN?'Japan':'日本',        data:rg.japan,       backgroundColor:NAVY,    borderRadius:2, borderWidth:0, stack:'s'},
                {label: isEN?'Netherlands':'オランダ',data:rg.netherlands, backgroundColor:TAUPE,   borderRadius:2, borderWidth:0, stack:'s'},
                {label: isEN?'USA':'アメリカ',       data:rg.usa,         backgroundColor:GOLD,    borderRadius:2, borderWidth:0, stack:'s'},
                {label: isEN?'Singapore':'シンガポール',data:rg.singapore, backgroundColor:WARM,    borderRadius:2, borderWidth:0, stack:'s'},
                {label: isEN?'S.Korea':'韓国',       data:rg.korea,       backgroundColor:NAVY_S,  borderRadius:2, borderWidth:0, stack:'s'},
                {label: isEN?'Others':'その他',      data:rg.others,      backgroundColor:'#d4c4a4',borderRadius:2, borderWidth:0, stack:'s'}
              ]
            },
            options:{
              indexAxis:'y',
              responsive:true, maintainAspectRatio:false,
              plugins:{
                legend:{position:'bottom', labels:{usePointStyle:true, padding:12, font:{size:10}}},
                tooltip:{callbacks:{label:function(c){
                  return c.dataset.label+': '+c.parsed.x.toLocaleString()+(isEN?' companies':'社');
                }}}
              },
              scales:{
                x:{stacked:true, grid:grid,
                  ticks:{callback:function(v){return v.toLocaleString();}}},
                y:{stacked:true, grid:{display:false},
                  ticks:{font:{size:10}}}
              }
            }
          });
        });

        lazyChart('phForexChart', function(el){
          var fx = d.phForex;
          new Chart(el, {
            type:'bar',
            data:{
              labels: isEN ? fx.labelsEN : fx.labels,
              datasets:[{
                label: isEN ? 'Actual (2024)' : '実績（2024）',
                data: fx.actual,
                backgroundColor:NAVY_S, borderRadius:3, borderWidth:0
              },{
                label: isEN ? 'Target (2025)' : '目標（2025）',
                data: fx.target,
                backgroundColor:GOLD, borderRadius:3, borderWidth:0
              }]
            },
            options:{
              responsive:true, maintainAspectRatio:false,
              plugins:{
                legend:{position:'bottom', labels:{usePointStyle:true, font:{size:11}}},
                tooltip:{callbacks:{label:function(c){return c.dataset.label+': '+c.parsed.y+(isEN?' B USD':'億USD');}}}
              },
              scales:{
                x:{grid:{display:false}},
                y:{grid:grid, beginAtZero:true,
                  ticks:{callback:function(v){return v+(isEN ? 'B' : '億');}}}
              }
            }
          });
        });
    }
    try {
      var _c = sessionStorage.getItem(CACHE_KEY);
      if (_c) { renderWithData(JSON.parse(_c)); }
      else {
        fetch(DATA_URL)
          .then(function(r){ return r.json(); })
          .then(function(d){
            try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(d)); } catch(e){}
            renderWithData(d);
          })
          .catch(function(){});
      }
    } catch(e) {
      fetch(DATA_URL)
        .then(function(r){ return r.json(); })
        .then(renderWithData)
        .catch(function(){});
    }

    lazyChart('ecChart', function(el){
      new Chart(el, {
        data:{
          labels:['21Q1','21Q2','21Q3','21Q4','22Q1','22Q2','22Q3','22Q4'],
          datasets:[{
            type:'bar', label:'GMV (¥M)',
            data:[120,180,260,340,420,560,720,920],
            backgroundColor:'rgba(184,148,90,0.55)', borderRadius:3, order:2
          },{
            type:'line', label:'CVR %', yAxisID:'y1',
            data:[1.8,2.1,2.6,2.9,3.2,3.5,3.7,3.8],
            borderColor:NAVY, backgroundColor:'transparent',
            tension:0.4, borderWidth:2, pointRadius:3, pointBackgroundColor:NAVY, order:1
          }]
        },
        options:{
          responsive:true, maintainAspectRatio:false,
          plugins:{legend:{position:'bottom', labels:{usePointStyle:true, font:{size:10}}}},
          scales:{
            x:{grid:{display:false}},
            y:{grid:grid, beginAtZero:true, ticks:{callback:function(v){return v+'M';}}},
            y1:{position:'right', grid:{display:false}, beginAtZero:true, ticks:{callback:function(v){return v+'%';}}}
          }
        }
      });
    });
  });
})();
