onload = function () {
	/* Оформлення */
	var textareas = document.getElementsByTagName("textarea");
	// var originalSource = document.getElementById('source').innerHTML;
	for (var i = textareas.length - 1; i >= 0; i--) {
		textareas[i].onfocus = function () {
			if (this.value == '. . .') {
				this.value = '';
			}
		};
		textareas[i].onblur = function () {
			if (this.value) {
				return;
			} else {
				this.value = '. . .';
			}
		};
	}
	/* кінець оформлення */
	var cipher = new AffinCipher('source', 'dest');
	cipher.init();
	document.getElementById('encrypt').onclick = function () {
		cipher.encrypt();
	}
	document.getElementById('decrypt').onclick = function () {
		cipher.decrypt();
	}
	document.getElementById('alphabet').onkeyup = function () {
		this.setAttribute('title', this.value.length + ' символів');
	}
	document.getElementById('alphabet').onkeyup();
};

/**
 * @param string source id textarea з початковим текстом
 * @param string dest id textarea з зашифрованним текстом
 */
function AffinCipher(source, dest) {
	this.src = document.getElementById(source);
	this.dst = document.getElementById(dest);

	this.init = function () {
		this.alphabet = document.getElementById('alphabet').value;
		this.kInput = document.getElementById('K');
		this.aInput = document.getElementById('A');
		// this.prevAlph = this.alphabet.toLowerCase();
		this.prevAlph = this.alphabet;
		this.symbols = [];
		for (var i = 0; i < this.prevAlph.length; i++) {
			this.symbols.push(this.prevAlph.charAt(i));
		}
	};
	/**
	 * Перевіряє, чи є два числа взаємно простими.
	 * @param a int число
	 * @param b int число
	 * @return boolean true, якщо являються, false - інакше
	 **/
	this.isCoprime = function (a, b) {
		var min = Math.min(a, b);
		for (var i = 2; i <= min; i++) {
			if (!(a % i) && !(b % i))
				return false;
		}
		return true;
	};
	/**
	 * Повертає номер букви c в алфавіті symbols
	 * @param symbols array букви
	 * @param c буква
	 * @return int номер позиції c в symbols, -1, якщо така відсутня.
	*/
	this.getPos = function (c) {
		for (var i = 0; i < this.alphabet.length; i++) {
			if (this.alphabet.charAt(i) == c)
				return i;
		}
		return -1;
	};
	this.encrypt = function () {
		this.alphabet = document.getElementById('alphabet').value;
		var k = parseInt(this.kInput.value);
		var a = parseInt(this.aInput.value);
		this.kInput.value = k;
		this.aInput.value = a;
		if (!this.validate(a, k)) {
			return;
		}
		document.getElementById('error').style.display = 'none';
		var n = this.alphabet.length;
		// var text = this.src.value.toLowerCase();
		var text = this.src.value;
		var encryptedT = '';
		for (var i = 0; i < text.length; i++) {
			var c = text.charAt(i);
			var pos = this.alphabet.indexOf(c);
			if (pos < 0) {
				encryptedT += c; // НЕ шифруємо даний символ
				continue;
			}
			var newPos = (parseInt(pos) * k + a) % n;
			var newC = this.alphabet.charAt(newPos);
			encryptedT += newC;
		}
		this.dst.value = encryptedT;
	};
	this.decrypt = function () {
		this.alphabet = document.getElementById('alphabet').value;
		var k = parseInt(this.kInput.value);
		var a = parseInt(this.aInput.value);
		this.kInput.value = k;
		this.aInput.value = a;
		if (!this.validate(a, k)) {
			return;
		}
		document.getElementById('error').style.display = 'none';
		var n = this.alphabet.length;
		var kInverse = this.calcInverse(k, n);
		// var text = this.dst.value.toLowerCase();
		var text = this.dst.value;
		var decryptedT = '';
		for (var i = 0; i < text.length; i++) {
			var c = text.charAt(i);
			var pos = this.alphabet.indexOf(c);
			if (pos < 0) {
				decryptedT += c; // НЕ розшифровуємо даний символ
				continue;
			}
			var newPos = (kInverse * (parseInt(pos) + n - a)) % n;
			var newC = this.alphabet.charAt(newPos);
			decryptedT += newC;
		}
		this.src.value = decryptedT;
	};
	/**
	 * Перевіряє, чи коректні значення A і K.
	 * Встановлює текст помилки в div # error
	 * @param a int число A з форми
	 * @param k int число K з форми
	 * @return boolean true якщо все вірно, інакше - false.
	 */
	this.validate = function (a, k) {
		var coprime =
			'<a href="https://uk.wikipedia.org/wiki/%D0%92%D0%B7%D0%B0%D1%94%D0%BC%D0%BD%D0%BE_%D0%BF%D1%80%D0%BE%D1%81%D1%82%D1%96_%D1%87%D0%B8%D1%81%D0%BB%D0%B0" target="_blank">взаємно простими</a>';
		var errorDiv = document.getElementById('error');
		if (a != parseInt(a) || k != parseInt(k)) {
			errorDiv.style.display = 'block';
			errorDiv.innerHTML = 'A і K повинні бути цілими числами.';
			return false;
		}
		if (k <= 0 || a < 0) {
			errorDiv.style.display = 'block';
			errorDiv.innerHTML = 'A і K не можуть бути негативними; K не може дорівнювати нулю.';
			return false;
		}
		if (!this.isCoprime(this.alphabet.length, k)) {
			errorDiv.style.display = 'block';
			errorDiv.innerHTML = 'Довжина алфавіту (' +
				this.alphabet.length +
				') і K не повинні бути ' + coprime + '.';
			return false;
		}
		return true;
	};
	this.calcInverse = function (k, n) {
		for (var i = 1; i < n; i++) {
			if ((k * i) % n == 1)
				return i;
		}
		return 1;
	};

	/* Clear textareas */

	btnClearSource = document.getElementById('btn-clear-source').onclick = clearSource
	btnClearDest = document.getElementById('btn-clear-dest').onclick = clearDest

	function clearSource() {
		textareaSource = document.getElementById('source');
		textareaSource.value = ''
	}
	function clearDest() {
		textareaDest = document.getElementById('dest');
		textareaDest.value = ''
	}
}