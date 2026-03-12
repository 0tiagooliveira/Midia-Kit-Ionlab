export interface Product {
  id: string;
  name: string;
  mainImage: string;
  images: string[];
  brand: string;
  model: string;
  category: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Incubadora com aquecimento, resfriamento, fotoperíodo e controle de umidade relativa - BOD-I-ARFU",
    mainImage: "https://images.tcdn.com.br/img/img_prod/1357340/incubadora_com_aquecimento_resfriamento_fotoperiodo_e_controle_de_umidade_relativa_bod_i_arfu_7_1_2a47a6e4db93ac9a06c1e903155ce683.png",
    images: [
      "https://images.tcdn.com.br/img/img_prod/1357340/incubadora_com_aquecimento_resfriamento_fotoperiodo_e_controle_de_umidade_relativa_bod_i_arfu_7_1_2a47a6e4db93ac9a06c1e903155ce683.png",
      "https://images.tcdn.com.br/img/img_prod/1357340/incubadora_com_aquecimento_resfriamento_fotoperiodo_e_controle_de_umidade_relativa_bod_i_arfu_7_2_ed0690d1a0b4d0f89d9952cb8a258bf3.png",
      "https://images.tcdn.com.br/img/img_prod/1357340/incubadora_com_aquecimento_resfriamento_fotoperiodo_e_controle_de_umidade_relativa_bod_i_arfu_7_3_60078947631975043f97e41a9683bd6f.png",
      "https://images.tcdn.com.br/img/img_prod/1357340/incubadora_com_aquecimento_resfriamento_fotoperiodo_e_controle_de_umidade_relativa_bod_i_arfu_7_4_ede88e93d03816d81b9be3992bf55502.png",
      "https://images.tcdn.com.br/img/img_prod/1357340/incubadora_com_aquecimento_resfriamento_fotoperiodo_e_controle_de_umidade_relativa_bod_i_arfu_7_5_29ee8d5f88a97b7cf85548c18210171e.png",
      "https://images.tcdn.com.br/img/img_prod/1357340/incubadora_com_aquecimento_resfriamento_fotoperiodo_e_controle_de_umidade_relativa_bod_i_arfu_7_6_d984dd5540ace7d7172cb3a666d50a8b.png"
    ],
    brand: "Anco",
    model: "BOD-I-ARFU",
    category: "Equipamentos"
  },
  {
    id: "2",
    name: "Pescador de Barras Magnéticas - 20619.01B",
    mainImage: "https://images.tcdn.com.br/img/img_prod/1357340/pescador_de_barras_magneticas_20619_01b_13963_1_0a76e8627b5fc9b72d91e3298b56bb8b.png",
    images: [
      "https://images.tcdn.com.br/img/img_prod/1357340/pescador_de_barras_magneticas_20619_01b_13963_1_0a76e8627b5fc9b72d91e3298b56bb8b.png"
    ],
    brand: "Satra",
    model: "20619.01B",
    category: "Ferragens"
  },
  {
    id: "3",
    name: "Agitador Vortex Digital até 2,800RPM Velocidade regulável - VX-28-DIG-BI",
    mainImage: "https://images.tcdn.com.br/img/img_prod/1357340/agitador_vortex_digital_at_2800rpm_velocidade_regu_1_20250827135202_275ebc6c90b9.jpg",
    images: [
      "https://images.tcdn.com.br/img/img_prod/1357340/agitador_vortex_digital_at_2800rpm_velocidade_regu_1_20250827135202_275ebc6c90b9.jpg",
      "https://images.tcdn.com.br/img/img_prod/1357340/agitador_vortex_digital_ate_2_800rpm_velocidade_regulavel_vx_28_dig_bi_14091_1_2696b255defdb7047aea5f555c5d7bbe.png"
    ],
    brand: "Satra",
    model: "VX-28-DIG-BI",
    category: "Equipamentos"
  },
  {
    id: "4",
    name: "Analisador de Umidade de Halogênio | AUH16-1",
    mainImage: "https://images.tcdn.com.br/img/img_prod/1357340/analisador_de_umidade_de_halogenio_auh16_1_14108_1_4e53d35bca1473a3f52e2634dd07603c.png",
    images: [
      "https://images.tcdn.com.br/img/img_prod/1357340/analisador_de_umidade_de_halogenio_auh16_1_14108_1_4e53d35bca1473a3f52e2634dd07603c.png"
    ],
    brand: "Bioscale",
    model: "AUH16-1",
    category: "Equipamentos"
  },
  {
    id: "5",
    name: "Bomba de Vácuo tipo Membrana - VAC26-BI",
    mainImage: "https://images.tcdn.com.br/img/img_prod/1357340/bomba_de_vacuo_tipo_membrana_vac26_bi_14253_1_4f648ff06f2f9c23cb370197b2592023.png",
    images: [
      "https://images.tcdn.com.br/img/img_prod/1357340/bomba_de_vacuo_tipo_membrana_vac26_bi_14253_1_4f648ff06f2f9c23cb370197b2592023.png"
    ],
    brand: "Satra",
    model: "VAC26-BI",
    category: "Equipamentos"
  },
  {
    id: "6",
    name: "ÁGAR BASE BAIRD PARKER - FRASCO 500G - MARCA ION - IO013-500",
    mainImage: "https://images.tcdn.com.br/img/img_prod/1357340/agar_base_baird_parker_frasco_500g_marca_ion_io013_500_15436_1_aa80d04ac9b2e68aad7fbddf039d0691.png",
    images: [
      "https://images.tcdn.com.br/img/img_prod/1357340/agar_base_baird_parker_frasco_500g_marca_ion_io013_500_15436_1_aa80d04ac9b2e68aad7fbddf039d0691.png"
    ],
    brand: "IonCult",
    model: "IO013-500",
    category: "Meios de Cultura"
  },
  {
    id: "7",
    name: "Lâminas para Microscopia Lapidada com Ponta Lisa - 7101-50",
    mainImage: "https://images.tcdn.com.br/img/img_prod/1357340/laminas_para_microscopia_ponta_lisa_7101_50_15533_1_5d5ea4f538d5f8c7d1b98c771893e2ca.png",
    images: [
      "https://images.tcdn.com.br/img/img_prod/1357340/laminas_para_microscopia_ponta_lisa_7101_50_15533_1_5d5ea4f538d5f8c7d1b98c771893e2ca.png",
      "https://images.tcdn.com.br/img/img_prod/1357340/laminas_para_microscopia_ponta_lisa_7101_50_15533_2_8f107f7641911acd0ac198f6c2abff74.png"
    ],
    brand: "Ionglass",
    model: "7101-50",
    category: "Vidraria"
  },
  {
    id: "8",
    name: "Microscópio biológico multivisualização 2 cabeçotes - BIO3204-BI",
    mainImage: "https://images.tcdn.com.br/img/img_prod/1357340/microscopio_biologico_multivisualizacao_2_cabecotes_bio3204_bi_15589_1_45702e7c6c86f3a74889260cd383251b.png",
    images: [
      "https://images.tcdn.com.br/img/img_prod/1357340/microscopio_biologico_multivisualizacao_2_cabecotes_bio3204_bi_15589_1_45702e7c6c86f3a74889260cd383251b.png"
    ],
    brand: "Biofocus",
    model: "BIO3204-BI",
    category: "Equipamentos"
  },
  {
    id: "9",
    name: "Eletrodo Combinado Universal de Plastico 0 a 14PH - E-64",
    mainImage: "https://images.tcdn.com.br/img/img_prod/1357340/eletrodo_combinado_universal_de_plastico_0_a_14ph_e_64_15794_1_349bfb940bf6232cf033109610c42ca0.png",
    images: [
      "https://images.tcdn.com.br/img/img_prod/1357340/eletrodo_combinado_universal_de_plastico_0_a_14ph_e_64_15794_1_349bfb940bf6232cf033109610c42ca0.png"
    ],
    brand: "Satra",
    model: "E-64",
    category: "pHmetros"
  },
  {
    id: "10",
    name: "Refratômetro de Bancada ABBE - AR1000",
    mainImage: "https://images.tcdn.com.br/img/img_prod/1357340/refratometro_de_bancada_abbe_ar1000_16172_1_221c1eedf56750030ceb254e478c7766.png",
    images: [
      "https://images.tcdn.com.br/img/img_prod/1357340/refratometro_de_bancada_abbe_ar1000_16172_1_221c1eedf56750030ceb254e478c7766.png",
      "https://images.tcdn.com.br/img/img_prod/1357340/refratometro_de_bancada_abbe_ar1000_16172_2_03a5a76e1be87b990ba454e629a41c4d.png",
      "https://images.tcdn.com.br/img/img_prod/1357340/refratometro_de_bancada_abbe_ar1000_16172_3_b46698ac690b2452507c4c46a0420513.png",
      "https://images.tcdn.com.br/img/img_prod/1357340/refratometro_de_bancada_abbe_ar1000_16172_4_abf88ec48af1a7f989d715c347898edb.png"
    ],
    brand: "Satra",
    model: "AR1000",
    category: "Equipamentos"
  },
  {
    id: "11",
    name: "Lamparina a Álcool em Vidro com Tampa e Pavio de Corda, sem Graduação de 150ml - 1381-150",
    mainImage: "https://images.tcdn.com.br/img/img_prod/1357340/lamparina_a_alcool_em_vidro_com_tampa_e_pavio_de_corda_sem_graduacao_1381_16493_1_d547c60791c54f34f01ffe0e58c9bfb5.png",
    images: [
      "https://images.tcdn.com.br/img/img_prod/1357340/lamparina_a_alcool_em_vidro_com_tampa_e_pavio_de_corda_sem_graduacao_1381_16493_1_d547c60791c54f34f01ffe0e58c9bfb5.png",
      "https://images.tcdn.com.br/img/img_prod/1357340/lamparina_a_alcool_em_vidro_com_tampa_e_pavio_de_corda_sem_graduacao_1381_16493_2_241c2626bf728ed92d2361125240488e.png"
    ],
    brand: "Ionglass",
    model: "1381-150",
    category: "Vidraria"
  },
  {
    id: "12",
    name: "Rack de polipropileno azul 100 tubos criogênicos ou microtubos 1,5/2,0 ml com tampa Gene GEBD032B",
    mainImage: "https://images.tcdn.com.br/img/img_prod/1357340/rack_de_polipropileno_azul_100_tubos_criogenicos_ou_microtubos_1_5_2_0_ml_com_tampa_gene_gebd0_b_76981_1_6cc5f71fb163de364b8b207adbe2f77d.png",
    images: [
      "https://images.tcdn.com.br/img/img_prod/1357340/rack_de_polipropileno_azul_100_tubos_criogenicos_ou_microtubos_1_5_2_0_ml_com_tampa_gene_gebd0_b_76981_1_6cc5f71fb163de364b8b207adbe2f77d.png"
    ],
    brand: "Gene",
    model: "GEBD032B",
    category: "Plásticos"
  },
  {
    id: "13",
    name: "Micropipeta Monocanal Série Exclusive Volume Fixo, marca Jetta - FIX",
    mainImage: "https://images.tcdn.com.br/img/img_prod/1357340/micropipeta_monocanal_serie_exclusive_volume_fixo_marca_jetta_fix_77021_1_811e1a0fb0dead5b3e21529d8f9ac9c9.png",
    images: [
      "https://images.tcdn.com.br/img/img_prod/1357340/micropipeta_monocanal_serie_exclusive_volume_fixo_marca_jetta_fix_77021_1_811e1a0fb0dead5b3e21529d8f9ac9c9.png"
    ],
    brand: "Jetta",
    model: "FIX",
    category: "Micropipetas"
  },
  {
    id: "14",
    name: "Tubo de centrifugação tipo Falcon de 15ml, graduado e estéril, marca Gene - GEF15",
    mainImage: "https://images.tcdn.com.br/img/img_prod/1357340/tubo_de_centrifugacao_tipo_falcon_de_15ml_graduado_e_esteril_marca_gene_gef15_77123_1_598dcd76583cc6e7c8e7c9da4e79e91e.png",
    images: [
      "https://images.tcdn.com.br/img/img_prod/1357340/tubo_de_centrifugacao_tipo_falcon_de_15ml_graduado_e_esteril_marca_gene_gef15_77123_1_598dcd76583cc6e7c8e7c9da4e79e91e.png",
      "https://images.tcdn.com.br/img/img_prod/1357340/tubo_de_centrifugacao_tipo_falcon_de_15ml_graduado_e_esteril_marca_gene_gef15_77123_2_f3a791ea43f7d3441301bac9f49e9394.png"
    ],
    brand: "Gene",
    model: "GEF15",
    category: "Plásticos"
  },
  {
    id: "15",
    name: "Copo de Bêquer forma baixa Griffin em vidro Boro 3.3 graduado - 1101-4000",
    mainImage: "https://images.tcdn.com.br/img/img_prod/1357340/copo_de_bquer_forma_baixa_griffin_em_vidro_boro_33_1_20250828160209_751315556ac1.png",
    images: [
      "https://images.tcdn.com.br/img/img_prod/1357340/copo_de_bquer_forma_baixa_griffin_em_vidro_boro_33_1_20250828160209_751315556ac1.png",
      "https://images.tcdn.com.br/img/img_prod/1357340/copo_de_bquer_forma_baixa_griffin_em_vidro_boro_33_2_20250904161500_2cf7ace0f643.png"
    ],
    brand: "Ionglass",
    model: "1101-4000",
    category: "Vidraria"
  },
  {
    id: "16",
    name: "Esqueleto humano com ligamentos e origem/inserção muscular, 180cm - CL-101A",
    mainImage: "https://images.tcdn.com.br/img/img_prod/1357340/esqueleto_humano_com_ligamentos_e_origem_insercao_muscular_180cm_cl_101a_79067_1_aea2bb50cd3a6e36225c2e0d9340f134.png",
    images: [
      "https://images.tcdn.com.br/img/img_prod/1357340/esqueleto_humano_com_ligamentos_e_origem_insercao_muscular_180cm_cl_101a_79067_1_aea2bb50cd3a6e36225c2e0d9340f134.png"
    ],
    brand: "Clone",
    model: "CL-101A",
    category: "Anatômicos e Simuladores"
  },
  {
    id: "17",
    name: "Cubeta de Quartzo Standard com Tampa, Caminho Ótico 1mm, Volume 0,35ml, marca Ioncell - Q-1",
    mainImage: "https://images.tcdn.com.br/img/img_prod/1357340/cubeta_de_quartzo_standard_com_tampa_caminho_otico_1mm_volume_0_35ml_marca_ioncell_q_1_77203_1_1001e17a4fc76c170fd86f4991c58506.png",
    images: [
      "https://images.tcdn.com.br/img/img_prod/1357340/cubeta_de_quartzo_standard_com_tampa_caminho_otico_1mm_volume_0_35ml_marca_ioncell_q_1_77203_1_1001e17a4fc76c170fd86f4991c58506.png",
      "https://images.tcdn.com.br/img/img_prod/1357340/cubeta_de_quartzo_standard_com_tampa_caminho_otico_1mm_volume_0_35ml_marca_ioncell_q_1_77203_2_aa027106c0591dbef2b202612795ffa2.png"
    ],
    brand: "Ioncell",
    model: "Q-1",
    category: "Cubetas"
  },
  {
    id: "18",
    name: "Termociclador Automático com Gradiente LCD 5.7 polegadas - TION96",
    mainImage: "https://images.tcdn.com.br/img/img_prod/1357340/termociclador_automatico_com_gradiente_lcd_5_7_polegadas_tion96_79941_1_eae4c199723e1dfabde861a5ee69d45e.png",
    images: [
      "https://images.tcdn.com.br/img/img_prod/1357340/termociclador_automatico_com_gradiente_lcd_5_7_polegadas_tion96_79941_1_eae4c199723e1dfabde861a5ee69d45e.png"
    ],
    brand: "IonPCR",
    model: "TION96",
    category: "Equipamentos"
  }
];
