import { useState, useEffect } from 'react';
import './index.css';

const API_URL = 'http://localhost:5138/api';

// Tipos
interface Usuario {
  id: string;
  nome: string;
  email: string;
}

interface Servico {
  id: number;
  nome: string;
  preco: number;
  duracaoMinutos: number;
}

interface Profissional {
  id: number;
  nome: string;
}

// Componente Header
interface HeaderProps {
  usuario: Usuario | null;
  onLogout: () => void;
}

const Header = ({ usuario, onLogout }: HeaderProps) => {
  return (
    <header className="header">
      <div className="header-container">
        <h1 className="logo">Beauty Salon</h1>
        <nav className="nav">
          <a href="#inicio">Início</a>
          <a href="#servicos">Serviços</a>
            {usuario && <a href="#meus-agendamentos">Meus Agendamentos</a>}
          <a href="#agendar">Agendar</a>
          <a href="#contato">Contato</a>
          {usuario && (
            <div className="user-info">
              <span className="user-name">👤 {usuario.nome}</span>
              <button onClick={onLogout} className="logout-btn">Sair</button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

// Componente Login
interface LoginProps {
  onLoginSuccess: (usuario: Usuario) => void;
}

const Login = ({ onLoginSuccess }: LoginProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Login - POST para /api/usuarios/login
        const response = await fetch(`${API_URL}/usuarios/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            senha: formData.senha,
          }),
        });

        if (response.ok) {
          const userData = await response.json();
          const usuario: Usuario = {
            id: userData.usuarioId,
            nome: userData.nome,
            email: userData.email,
          };
          // Armazena senha localmente (inseguro) conforme solicitado
          try { localStorage.setItem('userPassword', formData.senha); } catch {};
          // Armazena dados do usuário para persistência de sessão
          try { localStorage.setItem('usuarioId', usuario.id); } catch {};
          try { localStorage.setItem('userName', usuario.nome); } catch {};
          try { localStorage.setItem('userEmail', usuario.email); } catch {};
          onLoginSuccess(usuario);
        } else {
          setError(' E-mail ou senha incorretos.');
        }
      } else {
        // Registro
        const response = await fetch(`${API_URL}/usuarios`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nome: formData.nome,
            email: formData.email,
            senha: formData.senha,
          }),
        });

        if (response.ok) {
          const userData = await response.json();
          const usuario: Usuario = {
            id: userData.usuarioId || userData.id,
            nome: userData.nome,
            email: userData.email,
          };
          try { localStorage.setItem('userPassword', formData.senha); } catch {};
          // Armazena dados do usuário para persistência de sessão
          try { localStorage.setItem('usuarioId', usuario.id); } catch {};
          try { localStorage.setItem('userName', usuario.nome); } catch {};
          try { localStorage.setItem('userEmail', usuario.email); } catch {};
          onLoginSuccess(usuario);
          setFormData({ nome: '', email: '', senha: '' });
        } else {
          setError(' Erro ao registrar. Tente novamente.');
        }
      }
    } catch (err) {
      setError(' Erro na conexão com o servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isLogin ? 'Login' : 'Registrar'}</h2>
        {error && <p className="error-message">{error}</p>}
        
        <form onSubmit={handleSubmit} className="form">
          {!isLogin && (
            <div className="form-group">
              <label>Nome</label>
              <input
                type="text"
                name="nome"
                placeholder="Seu Nome Completo"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>E-mail</label>
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group password-group">
            <label>Senha</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="senha"
                placeholder="Senha"
                value={formData.senha}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                <span className="material-icons">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Aguarde...' : (isLogin ? 'Entrar' : 'Registrar')}
          </button>
        </form>

        <p className="toggle-form">
          {isLogin ? 'Não tem conta?' : 'Já tem conta?'}
          <button 
            type="button" 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="link-btn"
          >
            {isLogin ? 'Registre-se aqui' : 'Faça login'}
          </button>
        </p>
      </div>
    </div>
  );
};

// Componente FormAgendamento
interface FormAgendamentoProps {
  usuario: Usuario;
  servicos: Servico[];
  profissionais: Profissional[];
  onAddAgendamento: () => void;
}

const FormAgendamento = ({ usuario, servicos, profissionais, onAddAgendamento }: FormAgendamentoProps) => {
  const [formData, setFormData] = useState({
    nome: usuario.nome,
    email: usuario.email,
    telefone: '',
    servicoId: 0,
    profissionalId: 0,
    data: '',
    hora: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorFields, setErrorFields] = useState<Set<string>>(new Set());

  // Fecha o modal automaticamente após X ms (3s por padrão)
  useEffect(() => {
    if (!showSuccessModal) return;
    const AUTO_CLOSE_MS = 3000;
    const t = setTimeout(() => setShowSuccessModal(false), AUTO_CLOSE_MS);
    return () => clearTimeout(t);
  }, [showSuccessModal]);

  // Validar email
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Formatar telefone (11) 9 9999-9999
  const formatPhoneNumber = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, '');
    
    if (onlyNumbers.length <= 2) {
      return onlyNumbers.length > 0 ? `(${onlyNumbers}` : '';
    } else if (onlyNumbers.length <= 7) {
      return `(${onlyNumbers.slice(0, 2)}) ${onlyNumbers.slice(2)}`;
    } else {
      return `(${onlyNumbers.slice(0, 2)}) ${onlyNumbers.slice(2, 7)}-${onlyNumbers.slice(7, 11)}`;
    }
  };

  // Obter data mínima (hoje)
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Validar se a hora é válida para a data selecionada
  const isValidTime = (selectedDate: string, selectedTime: string) => {
    const today = getTodayDate();
    
    if (selectedDate === today) {
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const now = new Date();
      const selectedDateTime = new Date();
      selectedDateTime.setHours(hours, minutes, 0);
      
      // Hora deve ser pelo menos 1 hora no futuro
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
      return selectedDateTime >= oneHourLater;
    }
    
    return true; // Qualquer hora é válida para datas futuras
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Remover o campo do conjunto de erros quando o usuário começa a digitar
    if (errorFields.has(name)) {
      const newErrorFields = new Set(errorFields);
      newErrorFields.delete(name);
      setErrorFields(newErrorFields);
    }
    
    if (name === 'nome') {
      // Limitar a 150 caracteres
      if (value.length <= 150) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else if (name === 'telefone') {
      // Limitar a 14 caracteres (máscara completa)
      const formatted = formatPhoneNumber(value);
      if (formatted.length <= 15) {
        setFormData(prev => ({ ...prev, [name]: formatted }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: (name === 'servicoId' || name === 'profissionalId') ? parseInt(value) : value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSucesso('');
    const newErrorFields = new Set<string>();

    // Validações
    if (formData.nome.trim().length === 0) {
      setError(' Nome é obrigatório');
      newErrorFields.add('nome');
      setErrorFields(newErrorFields);
      setLoading(false);
      return;
    }

    if (!isValidEmail(formData.email)) {
      setError(' E-mail inválido');
      newErrorFields.add('email');
      setErrorFields(newErrorFields);
      setLoading(false);
      return;
    }

    if (formData.telefone && formData.telefone.replace(/\D/g, '').length < 10) {
      setError(' Telefone deve ter pelo menos 10 dígitos');
      newErrorFields.add('telefone');
      setErrorFields(newErrorFields);
      setLoading(false);
      return;
    }

    if (formData.servicoId === 0) {
      setError(' Selecione um serviço');
      setErrorFields(newErrorFields);
      setLoading(false);
      return;
    }

    if (formData.profissionalId === 0) {
      setError(' Selecione um profissional');
      setErrorFields(newErrorFields);
      setLoading(false);
      return;
    }

    if (!formData.data) {
      setError(' Data é obrigatória');
      newErrorFields.add('data');
      setErrorFields(newErrorFields);
      setLoading(false);
      return;
    }

    if (formData.data < getTodayDate()) {
      setError(' Não é permitido agendar para datas passadas');
      newErrorFields.add('data');
      setErrorFields(newErrorFields);
      setLoading(false);
      return;
    }

    if (!formData.hora) {
      setError(' Hora é obrigatória');
      newErrorFields.add('hora');
      setErrorFields(newErrorFields);
      setLoading(false);
      return;
    }

    if (!isValidTime(formData.data, formData.hora)) {
      setError(' Para hoje, a hora deve ser maior que a hora atual');
      newErrorFields.add('hora');
      setErrorFields(newErrorFields);
      setLoading(false);
      return;
    }

    // Limpar erro fields se validação passou
    setErrorFields(new Set());

    try {
      // Criar Date interpretando o input como horário local do navegador
      const [year, month, day] = formData.data.split('-').map(Number);
      const [hours, minutes] = formData.hora.split(':').map(Number);
      
      // new Date(year, month, day, hours, minutes) já converte automaticamente para UTC
      // Não precisa adicionar offset, JavaScript faz isso internamente
      const dataHoraLocal = new Date(year, month - 1, day, hours, minutes);
      
      const response = await fetch(`${API_URL}/Agendamentos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuarioId: usuario.id,
          servicoId: formData.servicoId,
          profissionalId: formData.profissionalId,
          data: dataHoraLocal.toISOString(),
        }),
      });

      if (response.ok) {
        setSucesso('✅ Agendamento realizado com sucesso! Em breve entraremos em contato.');
        setShowSuccessModal(true);
        setFormData({
          nome: usuario.nome,
          email: usuario.email,
          telefone: '',
          servicoId: 0,
          profissionalId: 0,
          data: '',
          hora: '',
        });
        onAddAgendamento();
        // keep the modal open until user closes it; also clear inline message after a short delay
        setTimeout(() => setSucesso(''), 3000);
      } else {
        setError(' Erro ao criar agendamento');
      }
    } catch (err) {
      setError(' Erro na conexão com o servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="agendar" className="form-section">
      <div className="form-container">
        <h2>Agende seu Horário</h2>
        {error && <p className="error-message">{error}</p>}
        {sucesso && <p className="success-message">{sucesso}</p>}
        
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Nome <span className="char-count">({formData.nome.length}/150)</span></label>
            <input
              type="text"
              name="nome"
              placeholder="Seu Nome Completo"
              value={formData.nome}
              onChange={handleChange}
              maxLength={150}
              className={errorFields.has('nome') ? 'error-input' : ''}
              required
            />
          </div>

          <div className="form-group">
            <label>E-mail</label>
            <input
              type="email"
              name="email"
              placeholder="seu.email@example.com"
              value={formData.email}
              onChange={handleChange}
              pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
              className={errorFields.has('email') ? 'error-input' : ''}
              required
            />
          </div>

          <div className="form-group">
            <label>Telefone</label>
            <input
              type="text"
              name="telefone"
              placeholder="(11) 99999-9999"
              value={formData.telefone}
              onChange={handleChange}
              maxLength={15}
              className={errorFields.has('telefone') ? 'error-input' : ''}
            />
          </div>

          <div className="form-group">
            <label>Serviço</label>
            <select
              name="servicoId"
              value={formData.servicoId}
              onChange={handleChange}
              required
            >
              <option value={0}>Selecione um serviço...</option>
              {servicos.map(s => (
                <option key={s.id} value={s.id}>
                  {s.nome} - R$ {s.preco.toFixed(2)} ({s.duracaoMinutos}min)
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Profissional</label>
            <select
              name="profissionalId"
              value={formData.profissionalId}
              onChange={handleChange}
              required
            >
              <option value={0}>Selecione um profissional...</option>
              {profissionais.map(p => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Data</label>
            <input
              type="date"
              name="data"
              value={formData.data}
              onChange={handleChange}
              min={getTodayDate()}
              className={errorFields.has('data') ? 'error-input' : ''}
              required
            />
          </div>

          <div className="form-group">
            <label>Hora</label>
            <input
              type="time"
              name="hora"
              value={formData.hora}
              onChange={handleChange}
              className={errorFields.has('hora') ? 'error-input' : ''}
              required
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading || !formData.servicoId || !formData.profissionalId}>
            {loading ? '⏳ Agendando...' : 'Confirmar Agendamento'}
          </button>
        </form>
        {showSuccessModal && (
          <div className="modal-overlay" role="dialog" aria-modal="true">
            <div className="modal-content">
              <h3>Agendamento Realizado com Sucesso!!</h3>
              <p>Obrigado! Seu horário foi agendado. Em breve entraremos em contato.</p>
              <button className="btn-submit" onClick={() => setShowSuccessModal(false)}>Fechar</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// Componente Serviços
interface ServicosProps {
  servicos: Servico[];
}

const Servicos = ({ servicos }: ServicosProps) => {
  const handleServiceClick = (servicoId: number) => {
    const formElement = document.getElementById('agendar');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
     
      const selectElement = document.querySelector('select[name="servicoId"]') as HTMLSelectElement;
      if (selectElement) {
        selectElement.value = servicoId.toString();
        selectElement.focus();
      }
    }
  };

  return (
    <section id="servicos" className="servicos-section">
      <div className="servicos-container">
        <h2>Nossos Serviços</h2>
        {servicos.length === 0 ? (
          <p className="empty-message">Carregando serviços...</p>
        ) : (
          <div className="servicos-grid">
            {servicos.map((servico) => (
              <div 
                key={servico.id} 
                className="servico-card clickable-card"
                onClick={() => handleServiceClick(servico.id)}
              >
                <h3>{servico.nome}</h3>
                <p className="duracao">⏱️ {servico.duracaoMinutos} minutos</p>
                <span className="preco">R$ {servico.preco.toFixed(2)}</span>
                <button className="btn-agendar">Agendar</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// Tipo Agendamento
interface Agendamento {
  id: string;
  usuarioId: string;
  data: string;
  cliente: string;
  servico: string;
  profissional: string;
}

// Função para converter UTC para GMT-3 (Brasília)
const formatToGMT3 = (isoString: string): string => {
  const date = new Date(isoString);
  // GMT-3 = UTC - 3 horas
  const gmt3Date = new Date(date.getTime() - 3 * 60 * 60 * 1000);
  return gmt3Date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

// Componente ListaAgendamentos - mostra apenas os agendamentos do usuário logado
interface ListaAgendamentosProps {
  usuario: Usuario;
  refresh: number;
}

const ListaAgendamentos = ({ usuario, refresh }: ListaAgendamentosProps) => {
  const [agendamentos, setAgendamentos] = useState<Agendamento[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchAgendamentos = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/Agendamentos`);
        if (!mounted) return;
        if (res.ok) {
          const data: Agendamento[] = await res.json();
          const meus = (data || []).filter(a => String(a.usuarioId) === String(usuario.id));
          setAgendamentos(meus);
        } else {
          setAgendamentos([]);
        }
      } catch (err) {
        console.error('Erro ao buscar agendamentos:', err);
        setAgendamentos([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAgendamentos();
    return () => { mounted = false; };
  }, [usuario, refresh]);

  if (loading) return (
    <section className="lista-section" id="meus-agendamentos">
      <div className="lista-container">
        <p className="empty-message">Carregando seus agendamentos...</p>
      </div>
    </section>
  );

  if (!agendamentos || agendamentos.length === 0) return (
    <section className="lista-section" id="meus-agendamentos">
      <div className="lista-container">
        <p className="empty-message">Você ainda não possui agendamentos.</p>
      </div>
    </section>
  );

  return (
    <section className="lista-section" id="meus-agendamentos">
      <div className="lista-container">
        <h2>Meus Agendamentos</h2>
        <div className="agendamentos-grid">
          {agendamentos.map(a => (
            <div key={a.id} className="agendamento-card">
              <div className="card-header">
                <h3>{a.servico}</h3>
                <small>{formatToGMT3(a.data)}</small>
              </div>
              <p><strong>Cliente:</strong> {a.cliente}</p>
              <p><strong>Profissional:</strong> {a.profissional}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Componente Footer
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; 2024 Beauty Salon. Todos os direitos reservados.</p>
        <p id="contato">Rua da Beleza, 123 | (11) 9999-9999 | contato@beautysalon.com</p>
      </div>
    </footer>
  );
};

// Componente Principal - App
export default function SalaoApp() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [loading, setLoading] = useState(true);
  const [agendamentoRefresh, setAgendamentoRefresh] = useState(0);

  // Carrega dados quando usuário faz login
  useEffect(() => {
    if (usuario) {
      carregarDados();
    }
  }, [usuario]);

  // Restaura sessão ao carregar a página
  useEffect(() => {
    const usuarioId = localStorage.getItem('usuarioId');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    
    if (usuarioId && userName && userEmail) {
      setUsuario({
        id: usuarioId,
        nome: userName,
        email: userEmail,
      });
    }
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [servicResponse, profResponse] = await Promise.all([
        fetch(`${API_URL}/servicos`),
        fetch(`${API_URL}/profissionais`),
      ]);

      if (servicResponse.ok) {
        const data: Servico[] = await servicResponse.json();
        setServicos(data || []);
      }

      if (profResponse.ok) {
        const data: Profissional[] = await profResponse.json();
        setProfissionais(data || []);
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (usuarioLogado: Usuario) => {
    setUsuario(usuarioLogado);
  };

  const handleLogout = () => {
    setUsuario(null);
    try { localStorage.removeItem('userPassword'); } catch {};
    // Remove dados de sessão
    try { localStorage.removeItem('usuarioId'); } catch {};
    try { localStorage.removeItem('userName'); } catch {};
    try { localStorage.removeItem('userEmail'); } catch {};
  };

  const handleAddAgendamento = () => {
    // refresh agendamentos list and reload service/professional data
    setAgendamentoRefresh(prev => prev + 1);
    carregarDados();
  };

  if (!usuario) {
    return (
      <div className="app">
        <Header usuario={null} onLogout={() => {}} />
        <main style={{ padding: '2rem' }}>
          <Login onLoginSuccess={handleLogin} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app">
      <Header usuario={usuario} onLogout={handleLogout} />
      <main>
        <section id="inicio" className="hero">
          <div className="hero-content">
            <h2>Bem-vindo ao Beauty Salon</h2>
            <p>O melhor lugar para cuidar da sua beleza</p>
            <a href="#agendar" className="cta-btn">Agende Agora</a>
          </div>
        </section>

        {loading ? (
          <section className="loading-section">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <h2>Preparando nossos melhores serviços...</h2>
              <div className="services-preview">
                <div className="service-item">💅 Manicure</div>
                <div className="service-item">✂️ Corte</div>
                <div className="service-item">🎨 Tintura</div>
                <div className="service-item">🪮 Depilação</div>
              </div>
            </div>
          </section>
        ) : (
          <>
            <Servicos servicos={servicos} />
            <ListaAgendamentos
              usuario={usuario}
              refresh={agendamentoRefresh}
            />
            <FormAgendamento 
              usuario={usuario}
              servicos={servicos}
              profissionais={profissionais}
              onAddAgendamento={handleAddAgendamento}
            />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
