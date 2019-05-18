function Field(size) {
	this.size = size
	this.cells = []
	
	for (let i = 0; i < size; i++) {
		this.cells[i] = []

		for (let j = 0; j < size; j++) 
			this.cells[i][j] = 0
	}

	let index = this.getEmptyIndex()
	this.cells[index.x][index.y] = 2

	index = this.getEmptyIndex()
	this.cells[index.x][index.y] = Math.random() > 0.5 ? 2 : 4
}

Field.prototype.getEmptyIndex = function() {
	let empty = []

	for (let i = 0; i < this.size; i++) 
		for (let j = 0; j < this.size; j++)
			if (this.cells[i][j] == 0) 
				empty.push({ x: j, y: i})

	if (empty.length == 0)
		return null

	return empty[Math.floor(Math.random() * empty.length)]
}	

Field.prototype.Draw = function(ctx) {
	ctx.rect(padding, padding, this.size * cellSize, this.size * cellSize)
	ctx.stroke()

	ctx.beginPath()
	ctx.font = "50px Arial"

	for (let i = 0; i < this.size; i++) {
		for (let j = 0; j < this.size; j++) {
			let y = padding + i * cellSize
			let x = padding + j * cellSize

			if (this.cells[i][j] != 0) {
				ctx.fillStyle = "#eee4da"
				ctx.fillRect(x, y, cellSize, cellSize)

				ctx.fillStyle = "#756b62"
				ctx.fillText(this.cells[i][j], x + cellSize / 2 - 25, y + cellSize / 2 + 25)
			}

			ctx.rect(x, y, cellSize, cellSize)
		}
	}

	ctx.stroke()
}

Field.prototype.AddTile = function() {
	let index = this.getEmptyIndex()

	if (index == null)
		return false

	this.cells[index.y][index.x] = Math.random() > 0.75 ? 4 : 2
}

Field.prototype.Slide = function(dir) {
	if (dir == left) 
		return this.SlideHorizontal(false)

	if (dir == right)
		return this.SlideHorizontal(true)

	if (dir == up)
		return this.SlideVertical(false)

	if (dir == down)
		return this.SlideVertical(true)
}

Field.prototype.SlideHorizontal = function(isRight) {
	let isSlide = false
	let dj = isRight ? -1 : 1

	let first = isRight ? this.size - 1 : 0
	let last = isRight ? -1 : this.size

	for (let i = 0; i < this.size; i++) {
		let k = first

		for (let j = first; j != last; j += dj) {
			if (this.cells[i][j] != 0) {
				if (k != j)
					isSlide = true

				this.cells[i][k] = this.cells[i][j]
				k += dj


				if (Math.abs(k - first) > 1 && this.cells[i][k - dj] == this.cells[i][k - dj * 2]) {
					this.cells[i][k - dj * 2] *= 2
					this.cells[i][k - dj] = 0
					k -= dj

					isSlide = true
				}
			}			
		}

		for (let j = k; j != last; j += dj)
			this.cells[i][j] = 0
	}

	return isSlide
}

Field.prototype.SlideVertical = function(isDown) {
	let isSlide = false
	let di = isDown ? -1 : 1

	let first = isDown ? this.size - 1 : 0
	let last = isDown ? -1 : this.size

	for (let j = 0; j < this.size; j++) {
		let k = first

		for (let i = first; i != last; i += di) {
			if (this.cells[i][j] != 0) {
				if (k != i)
					isSlide = true

				this.cells[k][j] = this.cells[i][j]
				k += di

				if (Math.abs(k - first) > 1 && this.cells[k - di][j] == this.cells[k - di * 2][j]) {
					this.cells[k - di * 2][j] *= 2
					this.cells[k - di][j] = 0
					k -= di

					isSlide = true
				}
			}			
		}

		for (let i = k; i != last; i += di)
			this.cells[i][j] = 0
	}
	
	return isSlide
}