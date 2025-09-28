import sinalAviso from "../assets/sinal-de-aviso.jpg"
import '../styles/Modal.css';

interface ModalProps {
    modalActive : string,
    dadosAtendimento: {
        nmPessoaFisica : string,
        dtNascimento : string,
        nrCpf : string,
        Sexo : string,
    },
    numeroAtendimento: string
    impedeProcessoCancelamento: () => void,
    cancelaAtendimento: () => void 
}

export const Modal = (props: ModalProps) => {
    return (
        <>
            <div className={"modal-wrapper " + props.modalActive}>
                <div className='modal-card'>
                    <div className='modal-header'>
                        <h1>
                            <img src={sinalAviso}
                                alt="ícone de cuidado"
                                width="24"
                                height="24"
                                style={{ verticalAlign: "middle", marginRight: "8px" }}></img>
                            Confirme os dados do atendimento
                        </h1>

                    </div>
                    <div className='modal-content'>
                        <p><b>Nome Paciente</b> : {props.dadosAtendimento.nmPessoaFisica}</p>
                        <p><b>Data Nascimento</b> : {props.dadosAtendimento.dtNascimento}</p>
                        <p><b>CPF </b>: {props.dadosAtendimento.nrCpf}</p>
                        <p><b>Sexo </b>: {props.dadosAtendimento.Sexo}</p>
                        <p><b>Atendimento</b>: {props.numeroAtendimento}</p>

                    </div>
                    <div className='modal-footer'>
                        <button className='modal-footer-bnt-nao' onClick={props.impedeProcessoCancelamento}>❌ Não</button>
                        <button className='modal-footer-bnt-sim' onClick={props.cancelaAtendimento}>✔️ Sim</button>
                    </div>
                </div>
            </div>
        </>
    )
}