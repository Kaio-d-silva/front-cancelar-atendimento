import React, { useState } from 'react';
import '../styles/Cancelamento.css';
import logo from "../assets/cerdil.jpg";
import api from '../http/api';
import { Modal } from './Modal';


function Cancelamento() {
  const [numeroAtendimento, setNumeroAtendimento] = useState('');
  const [motivoCancelamento, setMotivoCancelamento] = useState('');
  const [usuarioCancelamento, setUsuarioCancelamento] = useState('');
  const [mensagemStatus, setMensagemStatus] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [modalActive, setModal] = useState('hidden')

  const [dadosAtendimento, setDados] = useState({
    nmPessoaFisica: "",
    dtNascimento: "",
    Sexo: "",
    nrCpf: ""
  })

  const handleCancelamento = async () => {

    setMensagemStatus(''); 
    setIsSuccess(false);

    const { status, mensagem } = validaDados()
    if (!status) {
      setMensagemStatus(mensagem);
      setTimeout(() => {
        if(mensagemStatus !== "Aguardando confirmação"){
          setMensagemStatus('')
        }
      }, 2000)
      return
    }

    setMensagemStatus(mensagem);

    consultaAtendimento()
    setModal('visibible')

  };

  const consultaAtendimento = async () => {
    try {
      const response = await api.get(`/tasy/consulta-atendimento/${numeroAtendimento}`)
      console.log(response.data)
      setDados(response.data)
      const {DT_NASCIMENTO,IE_SEXO,NM_PESSOA_FISICA,NR_CPF} = response.data

      setDados({
        dtNascimento: DT_NASCIMENTO,
        nmPessoaFisica: NM_PESSOA_FISICA,
        nrCpf: NR_CPF,
        Sexo: IE_SEXO
      })
    } catch (error) {
      
      
    }
  }

  const cancelaAtendimento = async () => {
    setMensagemStatus("Processando cancelamento")
    try {

      const response = await api.post("tasy/cancelar-atendimento", {
        atendimentoId: numeroAtendimento,
        motivoCancelamento,
        nomeUsuario: usuarioCancelamento
      })


      if (response.status === 200) {
        setMensagemStatus(response.data?.message || "Cancelado com sucesso.")
        setIsSuccess(true)
        setNumeroAtendimento('');
        setMotivoCancelamento('');
        // setUsuarioCancelamento('');

      } else {
        setMensagemStatus(response.data?.error || 'Erro inesperado cancele manualmente.')
        setIsSuccess(false)
      }

      setModal("hidden")
    } catch (error: any) {
      setModal("hidden")
      setIsSuccess(false);
      setMensagemStatus(error.message);
      setTimeout(() => {
          setMensagemStatus('')
      }, 3000)
    }
  }

  const impedeProcessoCancelamento = () => {
    setModal("hidden")
    setNumeroAtendimento('');
    setMotivoCancelamento('');
    // setUsuarioCancelamento('');
    setMensagemStatus('')

  }

  const validaDados = () => {
    let status = false
    let mensagem = 'Aguardando confirmação'
    if (!numeroAtendimento || !motivoCancelamento || !usuarioCancelamento) {
      mensagem = 'Por favor, preencha todos os campos obrigatórios.'
      return { status, mensagem }
    }

    if (numeroAtendimento.length < 7) {
      mensagem = 'Tamanho do atendimento invalido'
      return { status, mensagem }
    }

    if (isNaN(Number(numeroAtendimento))) {
      mensagem = "Número do atendimento inválido"
      return { status, mensagem };
    }

    if (motivoCancelamento.length < 3 || motivoCancelamento.length > 255) {
      mensagem = 'Tamanho do motivo invalido'
      return { status, mensagem }
    }

    if (usuarioCancelamento.length < 4 || usuarioCancelamento.length > 20) {
      mensagem = 'Tamanho nome do usuario invalido'
      return { status, mensagem }
    }


    return { status: true, mensagem }
  }


  return (
    <main className='container'>
      <div className="cancelamento-wrapper">
        <div className="cancelamento-card">
          <div className="cancelamento-header">
            <img src={logo} alt="Cerdil Diagnósticos Avançados" className="cancelamento-logo" />
            <h2>Cancela Atendimento</h2>
            <p>Preencha os dados abaixo para prosseguir com o cancelamento.</p>
          </div>

          <form className="cancelamento-form" onSubmit={(e) => { e.preventDefault(); handleCancelamento(); }}>
            <div className="form-group">
              <label htmlFor="numeroAtendimento">Número do Atendimento <span className="required">*</span></label>
              <input
                type="text"
                id="numeroAtendimento"
                value={numeroAtendimento}
                onChange={(e) => setNumeroAtendimento(e.target.value)}
                placeholder="Ex: 1697140"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="motivoCancelamento">Motivo do Cancelamento <span className="required">*</span></label>
              <textarea
                id="motivoCancelamento"
                value={motivoCancelamento}
                onChange={(e) => setMotivoCancelamento(e.target.value)}
                placeholder="Descreva o motivo detalhadamente, por exemplo: 'Paciente desistiu', 'Erro na agendamento', etc."
                rows={4}
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="usuarioCancelamento">Usuário Responsável pelo Cancelamento <span className="required">*</span></label>
              <input
                type="text"
                id="usuarioCancelamento"
                value={usuarioCancelamento}
                onChange={(e) => setUsuarioCancelamento(e.target.value)}
                placeholder="Seu nome de usuário ou matrícula"
                required
              />
            </div>

            <button type="submit" className="cancel-button">
              Confirmar Cancelamento
            </button>

            {mensagemStatus && (
              <p className={`status-message ${isSuccess ? 'success' : 'error'}`}>
                {mensagemStatus}
              </p>
            )}
          </form>
        </div>
      </div>
      <Modal
        cancelaAtendimento={() => cancelaAtendimento()} 
        modalActive={modalActive} 
        dadosAtendimento = {dadosAtendimento}
        numeroAtendimento={numeroAtendimento} 
        impedeProcessoCancelamento={() => {
          impedeProcessoCancelamento()
        }}
        />
      
    </main>
  );
}

export default Cancelamento;