program DemostracionCompleta {
    // === DECLARACIÓN DE FUNCIONES (Deber ir al inicio del bloque program) ===
    
    // Función matemática recursiva
    int factorial(int n) {
        if (n <= 1) {
            return 1;
        }
        return n * factorial(n - 1);
    }

    // Función que procesa strings y devuelve bool
    bool validarNombre(string s) {
        if (s.contains("RE")) {
            return true;
        }
        return false;
    }

    // Función con decimales
    double calcularPromedio(double x, double y) {
        return (x + y) / 2.0;
    }

    // === CUERPO PRINCIPAL ===

    // 1. Tipos de Datos y Variables
    int entero = 10;
    double decimal = 5.5;
    string texto = "Lenguaje RE";
    bool bandera = true;
    var inferido = "Texto Inferido";

    print("=== 1. Variables y Inferencia ===");
    print("Entero: " + to_str(entero));
    print("Decimal: " + to_str(decimal));
    print("Texto: " + texto);
    print("Bool: " + to_str(bandera));
    print("Inferido: " + inferido);

    // 2. Operadores y Asignación Compuesta
    print("");
    print("=== 2. Operadores ===");
    entero += 5;   // 15
    decimal *= 2.0; // 11.0
    double pot = 2.0 ^ 3.0; // 8.0
    bool check = (entero > 12) and (not (decimal == 10.0));
    
    print("Entero += 5: " + to_str(entero));
    print("Decimal *= 2.0: " + to_str(decimal));
    print("Potencia 2^3: " + to_str(pot));
    print("Evaluación lógica: " + to_str(check));

    // 3. Control de Flujo (if, while, do-while, for-in)
    print("");
    print("=== 3. Control de Flujo ===");
    
    // Condicional
    if (entero < 10) {
        print("Menor a 10");
    } else if (entero == 15) {
        print("Es exactamente 15");
    } else {
        print("Otro valor");
    }

    // Bucle while
    int w = 0;
    print("While loop:");
    while (w < 3) {
        print("w: " + to_str(w));
        w += 1;
    }

    // Bucle do-while
    int d = 3;
    print("Do-While loop:");
    do {
        print("d: " + to_str(d));
        d -= 1;
    } while (d > 0);

    // Bucle for in con rango
    print("For in (rango 1..3):");
    for i in 1..3 {
        print("i: " + to_str(i));
    }

    // 4. Métodos de String
    print("");
    print("=== 4. Métodos de String ===");
    string saludo = "¡Hola Mundo de RE!";
    print("Original: " + saludo);
    print("Mayúsculas: " + saludo.upper());
    print("Minúsculas: " + saludo.lower());
    print("Tamaño: " + to_str(saludo.size()));
    print("¿Contiene 'Mundo'?: " + to_str(saludo.contains("Mundo")));
    print("Subcadena (1..5): " + saludo.substring(1, 5));

    // 5. Colecciones (Listas, Arreglos, Colas, Pilas)
    print("");
    print("=== 5. Colecciones ===");

    // Listas (Dinámicas)
    list<int> numeros = [10, 20, 30];
    numeros.add(40);
    print("Lista inicial: " + to_str(numeros));
    numeros.remove(1); // remueve index 1 (20)
    print("Lista tras remover index 1: " + to_str(numeros));
    print("Tamaño lista: " + to_str(numeros.size()));
    print("Obtener index 0: " + to_str(numeros.get(0)));

    // For in sobre lista
    print("Iterando lista:");
    for n in numeros {
        print("n: " + to_str(n));
    }

    // Arreglos (Tamaño Fijo)
    array<string> nombres = ["Ana", "Pedro", "Luis"];
    print("Arreglo: " + to_str(nombres));
    print("Tamaño arreglo: " + to_str(nombres.size()));
    print("Obtener index 1: " + nombres.get(1));

    // Colas (FIFO)
    queue<int> miCola = [];
    miCola.enqueue(100);
    miCola.enqueue(200);
    print("Cola inicial (size): " + to_str(miCola.size()));
    int sacadoCola = miCola.dequeue(); // 100
    print("Sacado de cola: " + to_str(sacadoCola));
    print("Cola final (size): " + to_str(miCola.size()));

    // Pilas (LIFO)
    stack<string> miPila = [];
    miPila.push("Base");
    miPila.push("Copa");
    print("Pila inicial (size): " + to_str(miPila.size()));
    string sacadoPila = miPila.pop(); // Copa
    print("Sacado de pila: " + sacadoPila);
    print("Pila final (size): " + to_str(miPila.size()));

    // 6. Funciones
    print("");
    print("=== 6. Funciones ===");
    print("Factorial de 5: " + to_str(factorial(5)));
    print("¿Validar 'Lenguaje RE'?: " + to_str(validarNombre("Lenguaje RE")));
    print("Calcular promedio: " + to_str(calcularPromedio(10.0, 20.0)));

    // 7. Input
    print("");
    print("=== 7. Entrada de Usuario ===");
    string nombreUsuario = input("Introduce tu nombre: ");
    print("¡Bienvenido al lenguaje RE, " + nombreUsuario + "!");
}
