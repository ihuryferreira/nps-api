async function auth() {
  try {
    const response = await fetch('http://localhost:3000/login', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({'login': 'admin', 'senha': 'admin'}),
    });

    const data = await response.json();
    localStorage.setItem('token', data.token);
  } catch (error) {
    console.error(error);
  }
}


function Modal({ message, onClose, isOpen, isSuccess }) {
  React.useEffect(() => {
    let timer;
    if (isOpen) {
      timer = setTimeout(() => {
        onClose();
      }, 5000); // 5 minutos em milissegundos
    }
    return () => {
      clearTimeout(timer); // Limpar o temporizador se o modal for fechado antes de 5 minutos
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div
        className={`bg-white p-6 rounded-lg shadow-lg ${
          isSuccess ? "border-green-500 border-2" : "border-red-500 border-2"
        } w-80`}
      >
        <div className="flex flex-col items-center mb-4 gap-0.5">
          <i
            className={`fas ${
              isSuccess
                ? "fa-check-circle text-green-500"
                : "fa-times-circle text-red-500"
            } text-4xl mr-3`}
          ></i>
          <p className="text-lg">{message}</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [formData, setFormData] = React.useState({
    pesquisa1: "",
    pesquisa2: "",
    pesquisa3: "",
    comentario: "",
  });

  const [errors, setErrors] = React.useState({
    pesquisa1: "",
    pesquisa2: "",
    pesquisa3: "",
  });

  const [modal, setModal] = React.useState({
    isOpen: false,
    message: "",
    isSuccess: false,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Limpar erro do campo correspondente ao mudar o valor
    if (name === "pesquisa1" || name === "pesquisa2" || name === "pesquisa3") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = { pesquisa1: "", pesquisa2: "", pesquisa3: "" };

    if (!formData.pesquisa1) {
      newErrors.pesquisa1 = "Este campo é obrigatório.";
      isValid = false;
    }
    if (!formData.pesquisa2) {
      newErrors.pesquisa2 = "Este campo é obrigatório.";
      isValid = false;
    }
    if (!formData.pesquisa3) {
      newErrors.pesquisa3 = "Este campo é obrigatório.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await auth();
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:3000/belavista", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setModal({
          isOpen: true,
          message: "Dados enviados com sucesso!",
          isSuccess: true,
        });
        // Limpar o formulário ou redirecionar o usuário
        setFormData({
          pesquisa1: "",
          pesquisa2: "",
          pesquisa3: "",
          comentario: "",
        });
        setErrors({
          pesquisa1: "",
          pesquisa2: "",
          pesquisa3: "",
        });
      } else {
        setModal({
          isOpen: true,
          message: "Ocorreu um erro ao enviar os dados.",
          isSuccess: false,
        });
      }
    } catch (error) {
      console.error("Erro:", error);
      setModal({
        isOpen: true,
        message: "Ocorreu um erro ao enviar os dados.",
        isSuccess: false,
      });
    }
  };

  const closeModal = () => {
    setModal({
      isOpen: false,
      message: "",
      isSuccess: false,
    });
  };

  return (
    <div className="max-w-lg mx-auto mt-4 p-4 border rounded-lg shadow-lg mb-4 bg-white">
      <div className="bg-red-600 text-white text-center py-2 rounded-t-lg">
        <h1 className="text-4xl font-bold">Pesquisa de Satisfação</h1>
      </div>
      <form onSubmit={handleSubmit} className="p-4">
        <p className="mb-4 text-2xl">
          Por favor, avalie os seguintes aspectos em uma escala de 1 a 10, sendo
          1 Nada Satisfeito e 10 Extremamente Satisfeito.
        </p>
        <div className="mb-4 p-4 border rounded-lg">
          <p className="mb-2 text-xl">
            1. Com base em sua última experiencia conosco, como você avalia a
            qualidade do atendimento prestado?
          </p>
          <select
            className={`w-full p-2 border rounded-lg ${
              errors.pesquisa1 ? "border-red-500" : ""
            }`}
            name="pesquisa1"
            value={formData.pesquisa1}
            onChange={handleChange}
          >
            <option value="">Selecione uma das opções abaixo:</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
          {errors.pesquisa1 && (
            <p className="text-red-500 text-sm mt-1">{errors.pesquisa1}</p>
          )}
        </div>
        <div className="mb-4 p-4 border rounded-lg">
          <p className="mb-2 text-xl">
            2. Você ficou satisfeito com a eficiência da entrega do seu pedido?
          </p>
          <select
            className={`w-full p-2 border rounded-lg ${
              errors.pesquisa2 ? "border-red-500" : ""
            }`}
            name="pesquisa2"
            value={formData.pesquisa2}
            onChange={handleChange}
          >
            <option value="">Selecione uma das opções abaixo:</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
          {errors.pesquisa2 && (
            <p className="text-red-500 text-sm mt-1">{errors.pesquisa2}</p>
          )}
        </div>
        <div className="mb-4 p-4 border rounded-lg">
          <p className="mb-2 text-xl">
            3. Em uma escala de 1 a 10, você nos recomendaria para amigos ou
            familiares?
          </p>
          <select
            className={`w-full p-2 border rounded-lg ${
              errors.pesquisa3 ? "border-red-500" : ""
            }`}
            name="pesquisa3"
            value={formData.pesquisa3}
            onChange={handleChange}
          >
            <option value="">Selecione uma das opções abaixo:</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
          {errors.pesquisa3 && (
            <p className="text-red-500 text-sm mt-1">{errors.pesquisa3}</p>
          )}
        </div>
        <div className="mb-4 p-4 border rounded-lg">
          <p className="mb-2 text-xl">
            Deixe aqui suas críticas, elogios ou sugestões:
          </p>
          <textarea
            className="w-full p-2 border rounded-lg"
            rows="4"
            name="comentario"
            value={formData.comentario}
            onChange={handleChange}
            placeholder="Escreva aqui..."
          ></textarea>
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="bg-red-600 text-white px-8 py-4 rounded-lg w-full text-2xl"
          >
            Enviar
          </button>
        </div>
      </form>
      <Modal
        message={modal.message}
        onClose={closeModal}
        isOpen={modal.isOpen}
        isSuccess={modal.isSuccess}
      />
    </div>
  );
}

// Atualizado para React 18
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
