import { VideoItem, ManualItem, GalleryItem } from './types';

export const VIDEOS: VideoItem[] = [
  // Agitadores
  {
    id: 'a1',
    category: 'Agitadores',
    title: 'Agitador Digital Tipo Roller, 20-100RPM, Rolo: 236MM, Bivolt - AGROL-BI',
    youtubeId: 'OYn18pqwEQk',
    shortsId: 'Cj4O_VH34Gs',
    downloadUrl: 'https://drive.google.com/drive/folders/1NMCU0-ofPn9yu4O4KxLXPOZo3o_TSe3d?usp=drive_link'
  },
  {
    id: 'a2',
    category: 'Agitadores',
    title: 'Agitador Analógico Tridimensional, 20RPM, Ângulo: 20° . Modo Continuo - AGTRI',
    youtubeId: '2_wfQNAnuS0',
    shortsId: '3DkALHKNmB8',
    downloadUrl: 'https://drive.google.com/drive/folders/1bRARcuJLRaN3OxdBZuqT1k1zSjF6a2Oz?usp=drive_link'
  },
  {
    id: 'a3',
    category: 'Agitadores',
    title: 'Agitador Magnético 2400RPM até 2L com Aquecimento 90ºC - HJ',
    youtubeId: '0oLe0QAVwXM',
    downloadUrl: 'https://drive.google.com/drive/folders/1bSvG7ewXLv95nsY_OTtrvzD_wdqu0zQj?usp=drive_link'
  },
  {
    id: 'a4',
    category: 'Agitadores',
    title: 'Agitador VDRL ou tipo Kline Digital até 350rpm - KLD-350-BI',
    youtubeId: '2SLktXS39xE',
    shortsId: 'tgTsf5Gq7Hs',
    downloadUrl: 'https://drive.google.com/drive/folders/1TAcpRt-wqrHsv6Xk7_GiV3EwfWfKRCmR?usp=drive_link'
  },
  // Anatomicos
  {
    id: 'an1',
    category: 'Anatômicos',
    title: 'Esqueleto humano com 180cm - CL-101',
    youtubeId: 'sF7F29X9bzA',
    shortsId: 'MVtuZA1wRfw',
    downloadUrl: 'https://drive.google.com/drive/folders/1hl4ahUyIz2k9FFxtWXvgBsvVnnPD2oqh?usp=drive_link'
  },
  {
    id: 'an2',
    category: 'Anatômicos',
    title: 'Articulação do Ombro Tamanho Real Com Músculos - CL-109A',
    youtubeId: 'MYe3uSNEKlE',
    shortsId: 'KLbZ60LCH-4',
    downloadUrl: 'https://drive.google.com/drive/folders/1nHVtrzwIxoWAj3cc1zvbaKp-VldM3Mda?usp=drive_link'
  },
  {
    id: 'an3',
    category: 'Anatômicos',
    title: 'Torso Masculino - 85CM com 19 Partes - CL-201',
    youtubeId: 'lR8dE5LUDvE',
    shortsId: 'GWMKDLKcf14',
    downloadUrl: 'https://drive.google.com/drive/folders/1eakIRJTPy8Q6pfCs_UPZBYbUZaW5N_dL?usp=drive_link'
  },
  // Banho Seco
  {
    id: 'bs1',
    category: 'Banho Seco',
    title: 'Banho seco digital - BS-150-S-BI',
    shortsId: 'o3xhvnsT1RI',
    thumbnailUrl: 'https://mcusercontent.com/d315c990296355ed94752eef4/images/92c97bf9-41f0-c067-4dc8-30b7c3551ec0.png',
    downloadUrl: '#'
  },
  // Centrifugas
  {
    id: 'c1',
    category: 'Centrífugas',
    title: 'Centrífuga Analógica até 4000rpm - 80-2B',
    youtubeId: 'wTlO53Y0DTc',
    shortsId: 'poVma57FZSc',
    downloadUrl: 'https://drive.google.com/drive/folders/1w2GJd247ppRGDDD5Gqw7oHBT8-GoAKf6?usp=drive_link'
  },
  {
    id: 'c2',
    category: 'Centrífugas',
    title: 'Centrífuga Digital até 4000rpm - 80-2B-DM',
    youtubeId: '0bERqVyc_3I',
    shortsId: '9FbWGbv7ouI',
    downloadUrl: 'https://drive.google.com/drive/folders/1LdlPxGNh7ewnWiCWMjbGq7EFz3q8s-5a?usp=drive_link'
  },
  {
    id: 'c3',
    category: 'Centrífugas',
    title: 'Centrifuga Digital até 4000 RPM, capacidade 8 tubos (10 ou 15 ml) - BIA-4000-BI',
    youtubeId: 'Qe6wOifWqtA',
    shortsId: 'L3pgV-GDlcc',
    downloadUrl: 'https://drive.google.com/drive/folders/1fY3shaZJDKOOWuZefaNIxgCkBqx9eniE?usp=drive_link'
  },
  {
    id: 'c4',
    category: 'Centrífugas',
    title: 'Centrífuga Digital até 5000rpm para 12 tubos - TITAN-12',
    youtubeId: 'nzDSc9UxeQs',
    shortsId: 'sV2kX1yeQxs',
    downloadUrl: 'https://drive.google.com/drive/folders/16sEzsflEvkag8-xyc8DmiQJFb3K0l0Ex?usp=drive_link'
  },
  // Contadores
  {
    id: 'ct1',
    category: 'Contadores',
    title: 'Contador de Colônias BIOCC-NM-BI',
    youtubeId: 'jdGeONPTb-E',
    shortsId: 'o4ZvSyaf4Dw',
    downloadUrl: 'https://drive.google.com/drive/folders/1lMlgsHw7s4F4ajD903WAoy5hlSkJNZuT?usp=drive_link'
  },
  {
    id: 'ct2',
    category: 'Contadores',
    title: 'Contador Manual de Células Sanguíneas com 8 Teclas - ION-1026',
    youtubeId: 'nMPoPQRpm8A',
    shortsId: 'TMzN2pcIZWk',
    downloadUrl: 'https://drive.google.com/drive/folders/16XwCQUqJ-LcNrOW9lsyTGDQA3c1cYsPd?usp=drive_link'
  },
  // Espectrofotômetros
  {
    id: 'e1',
    category: 'Espectrofotômetros',
    title: 'Espectrofotômetro Luz Visível 330-1020NM Banda 4NM - IL-120-BI',
    youtubeId: 'Bg_jdztpxVY',
    shortsId: 'gOPQppqT7Tc',
    downloadUrl: 'https://drive.google.com/drive/folders/1mW8Q99-ZLuTUInNaKDXWYTReR4leJGje?usp=drive_link'
  },
  {
    id: 'e2',
    category: 'Espectrofotômetros',
    title: 'Espectrofotômetro com Faixa UV-VIS de 195 à 1020nm e Largura de Banda de 5nm - IL-592-LC-BI',
    youtubeId: 'tB0zijdhwzM',
    shortsId: 'CyZ0UNdXoO8',
    downloadUrl: 'https://drive.google.com/drive/folders/1wKz4cA0ZGNjvPtAQc6Lgg9sSbPW0mwLa?usp=drive_link'
  },
  {
    id: 'e3',
    category: 'Espectrofotômetros',
    title: 'Espectrofotômetro TouchScreen NanoReady',
    youtubeId: 'XxYtT3Oqu3A',
    shortsId: '7kuD2sD5Yto',
    downloadUrl: 'https://drive.google.com/drive/folders/1wLo0C_1h2VljwNEdlqnK9csC9wdyuf0a?usp=drive_link'
  },
  // Consumíveis
  {
    id: 'con1',
    category: 'Consumíveis',
    title: 'Filme de Vedação Tipo Parafilm - PAR10163810',
    youtubeId: 'Z8bf4113z-I',
    thumbnailUrl: 'https://mcusercontent.com/d315c990296355ed94752eef4/images/d0d4dd41-ead6-0d99-f60e-2cee18bd6cca.png',
    downloadUrl: 'https://drive.google.com/drive/folders/1qMEDAWmPsq1P1NhDZ8YsCtMzIvt2kosK?usp=drive_link'
  },
  // Pets
  {
    id: 'p1',
    category: 'Pets',
    title: 'Maquina de Secar Animais Pets FULL DRY - SP2',
    youtubeId: 'KBMBJOZZQR0',
    downloadUrl: 'https://drive.google.com/drive/folders/1EuzyrPRYwJrCcN_JMGR1yjxX2nyZHPsS?usp=drive_link'
  },
  // ELISA
  {
    id: 'el1',
    category: 'ELISA',
    title: 'Leitora de Microplacas ELISA Tela 10.4 polegadas - DR-200B-NM-BI',
    youtubeId: 'f_b3B0z5u4Y',
    downloadUrl: 'https://drive.google.com/drive/folders/1Z5UF8mg1Grdq72Q5rGCJp-V6ma1FxTFg?usp=drive_link'
  },
  // Mantas Aquecedoras
  {
    id: 'm1',
    category: 'Mantas Aquecedoras',
    title: 'Manta Aquecedora Analógica com Agitação para Balão de Fundo Redondo | AMS900',
    youtubeId: 'dL2Rc4ZWB_8',
    downloadUrl: 'https://drive.google.com/drive/folders/1dW4gauQXpDYJ4ZSmg8RjXyhlJxc21qfq?usp=drive_link'
  },
  // Microscopia
  {
    id: 'mi1',
    category: 'Microscopia',
    title: 'Câmera Digital para Microscópio HDMI 10.5MP - BIO-HDMI',
    youtubeId: '4QCbjqcbbwo',
    shortsId: 'Iwq5HwUT6Ro',
    downloadUrl: 'https://drive.google.com/drive/folders/1JcXydE-quOdna2u91cGN0eAt_hIpsq0n?usp=drive_link'
  },
  {
    id: 'mi2',
    category: 'Microscopia',
    title: 'Microscópio biológico monocular - BLUE640MA-L-BI',
    youtubeId: 'VbsIz-gqrfU',
    shortsId: 'ryLK8l0D4uk',
    downloadUrl: 'https://drive.google.com/drive/folders/1OApLKWkz7eKV4s-fvHm__DXhmm-6QXx9?usp=drive_link'
  },
  {
    id: 'mi3',
    category: 'Microscopia',
    title: 'Microscópio Binocular Plan. BLUE 1000X Ótica Infinita',
    youtubeId: '4zMcGvIyoZ0',
    shortsId: 'JeQjpWa2krA',
    downloadUrl: 'https://drive.google.com/drive/folders/1jl85BsPKwAudfWm4ArfvqxtXMTOoFm9n?usp=drive_link'
  },
  {
    id: 'mi4',
    category: 'Microscopia',
    title: 'Microscópio Binocular Acro. Blue 1600X',
    shortsId: 'FGDZD-46D6s',
    downloadUrl: 'https://drive.google.com/drive/folders/1A018u3PZlF7dETRrM79njXOdGsZboS7A?usp=drive_link'
  },
  {
    id: 'mi5',
    category: 'Microscopia',
    title: 'Microscópio biológico Invertido Ótica infinita e Contraste de fases com kit de Fluorescência - BIO-INVERT-FLUO-BI',
    youtubeId: 'MdUE1eKvdNs',
    shortsId: 'CBsBeHdESaw',
    downloadUrl: 'https://drive.google.com/drive/folders/1UJHb4NvEsEIZzSc8URE9JqBft9c0HX6j?usp=drive_link'
  },
  {
    id: 'mi6',
    category: 'Microscopia',
    title: 'Microscópio Biológico Binocular, Revolver Quadruplo, aumento até 1600X, iluminação em LED - LC1600BA-L-BI',
    youtubeId: '2m0kN6XnL2A',
    shortsId: '_Nxv1jdkhc4',
    downloadUrl: 'https://drive.google.com/drive/folders/1dDOv28CNS6WlHmdnpd0w8KENwmEA4mnS?usp=drive_link'
  },
  {
    id: 'mi7',
    category: 'Microscopia',
    title: 'Estereomicroscópio com aumento até 80x - XT-3L-NM',
    youtubeId: 'aXne_3fY2aI',
    shortsId: 'UoYiW8qdruE',
    downloadUrl: 'https://drive.google.com/drive/folders/1LWbW1cx1VWeaCotVc2V0jmbfe57NKm3o?usp=drive_link'
  },
  // pHmetros
  {
    id: 'ph1',
    category: 'pHmetros',
    title: 'Eletrodo de pH de vidro - E-65',
    youtubeId: 'sfhlUT-dwxA',
    shortsId: '3Mwaf4UPIAk',
    downloadUrl: 'https://drive.google.com/drive/folders/1CnM08NVEo90zmh-EMREUkB6zOwEDi1zL?usp=drive_link'
  },
  {
    id: 'ph2',
    category: 'pHmetros',
    title: 'pHmetro tipo Tablet com Calibração Automática e Reconhecimento Automático de Eletrodos - PH-TABLET-BI',
    youtubeId: 'J0-2dGcRJ68',
    downloadUrl: 'https://drive.google.com/drive/folders/1gq9QM_EDgN9a-qPdhUZiJibYKiA6x2qX?usp=drive_link'
  },
  // Acessórios
  {
    id: 'ac1',
    category: 'Acessórios',
    title: 'Régua P/ Contagem Microhematorito CM-12000 Ou DTC-16000 - REGUA-MICROHE',
    youtubeId: 'PnJuIHg_TVU',
    shortsId: 'pgDB1af0Hx0',
    downloadUrl: 'https://drive.google.com/drive/folders/1BurBfR-eJNcOVWEWFrkU2yEss_6iY6Ac?usp=drive_link'
  },
  {
    id: 'ac2',
    category: 'Vidrarias',
    title: 'Câmara de Neubauer - OG-100',
    youtubeId: 'bjOyIGGljdo',
    shortsId: 'VWlDf7eAiaU',
    downloadUrl: 'https://drive.google.com/drive/folders/12NCLTIR4yD2DLQCmZnAUlmkM-U2GmGVa?usp=drive_link'
  },
  {
    id: 'ac3',
    category: 'Vidrarias',
    title: 'Câmara de Neubauer - OG-200',
    youtubeId: 'zJ94dnD_W5U',
    shortsId: 'DFibqhg9BPE',
    downloadUrl: 'https://drive.google.com/drive/folders/1FQgvBDcoNjbAPtb17rWtvBmYe2pmDcFp?usp=drive_link'
  },
  // Medição
  {
    id: 'med1',
    category: 'Medição',
    title: 'Termo-higrômetro Digital com 3 linhas de leitura - 10404-19',
    youtubeId: 'TtKxPZSmZVk',
    downloadUrl: 'https://drive.google.com/drive/folders/1AdTKHpHuYUS3W9MMZCwS8lkvP9xayzvb?usp=drive_link'
  },
  // Vidrarias
  {
    id: 'v1',
    category: 'Vidrarias',
    title: 'Dessecador em Vidro Incolor Tampa com Botão - 1351-300',
    youtubeId: 'xfH3y2PGspw',
    shortsId: 'j1IHyD0aRRs',
    downloadUrl: 'https://drive.google.com/drive/folders/13FXD0goS_doWIipb8J4WwmbwqN5p0gqo?usp=drive_link'
  },
  {
    id: 'v2',
    category: 'Vidrarias',
    title: 'Dessecador em Vidro Incolor Tampa com Torneira - 1354-300',
    youtubeId: 'r-MHKUPWWUM',
    shortsId: 'wDaP7g8tFJs',
    downloadUrl: 'https://drive.google.com/drive/folders/1hMHDID1gF4TumBfRdP-B71KJrZDbaoQg?usp=drive_link'
  },
  // Estufas
  {
    id: 'est1',
    category: 'Estufas',
    title: 'Estufa de Esterilização e Secagem Digital - Circulação e Renovação de Ar - Aquecimento até 200ºC - EESCRA-D',
    youtubeId: 'OjqzQvSl79Y',
    downloadUrl: '#'
  }
];

export const MANUAIS: ManualItem[] = [
  {
    id: '1',
    title: 'Manual de Identidade Visual',
    description: 'Guia completo de uso da marca IonLab.',
    downloadUrl: '#'
  }
];

export const FOTOS: GalleryItem[] = [
  {
    id: '1',
    title: 'Agitador Digital Roller',
    imageUrl: 'https://picsum.photos/seed/agitador1/800/600'
  }
];

export const ARTES: GalleryItem[] = [
  {
    id: '1',
    title: 'Post Instagram - Agitadores',
    imageUrl: 'https://picsum.photos/seed/art1/800/800',
    downloadUrl: '#'
  }
];
