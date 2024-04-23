var currentuser; // user hiện tại, biến toàn cục
window.onload = function () {
	khoiTao();



	currentuser = getCurrentUser();
	addProductToTable(currentuser);
}

function addProductToTable(user) {
	var table = document.getElementsByClassName('listSanPham')[0];

	var s = `
		<tbody>
			<tr>
				<th>STT</th>
				<th>Sản phẩm</th>
				<th>Giá</th>
				<th>Số lượng</th>
				<th>Thành tiền</th>
				<th>Thời gian</th>
				<th>Xóa</th>
			</tr>`;

	if (!user) {
		s += `
			<tr>
				<td colspan="7"> 
					<h1 style="color:red; background-color:white; font-weight:bold; text-align:center; padding: 15px 0;">
						Bạn chưa đăng nhập !!
					</h1> 
				</td>
			</tr>
		`;
		table.innerHTML = s;
		return;
	} else if (user.products.length == 0) {
		s += `
		<tr>
			<td colspan="7"> 
				<h1 style="color:green; background-color:white; font-weight:bold; text-align:center; padding: 15px 0;">
					Giỏ hàng trống !!
				</h1>
				<a href="index.html" style="color:white; text-decoration: none; border: 1px solid; background-color:#00CCFF; font-weight:bold; text-align:center; padding: 15px 0;">
					Bắt đầu mua sắm!
				</a> 
			</td>
		</tr>
		`;
		table.innerHTML = s;
		return;
	}

	var totalPrice = 0;
	for (var i = 0; i < user.products.length; i++) {
		var masp = user.products[i].ma;
		var soluongSp = user.products[i].soluong;
		var p = timKiemTheoMa(list_products, masp);
		var price = (p.promo.name == 'giareonline' ? p.promo.value : p.price);
		var thoigian = new Date(user.products[i].date).toLocaleString();
		var thanhtien = stringToNum(price) * soluongSp;

		s += `
			<tr>
			<td>` + (i + 1) + `</td>
			<td class="noPadding imgHide">
				<a >
					` + p.name + `
					<img src="` + p.img + `">
				</a>
			</td>
				<td class="alignRight">` + price + ` ₫</td>
				<td class="soluong" >
					<button onclick="giamSoLuong('` + masp + `')"><i class="fa fa-minus"></i></button>
					<input size="1" onchange="capNhatSoLuongFromInput(this, '` + masp + `')" value=` + soluongSp + `>
					<button onclick="tangSoLuong('` + masp + `')"><i class="fa fa-plus"></i></button>
				</td>
				<td class="alignRight">` + numToString(thanhtien) + ` ₫</td>
				<td style="text-align: center" >` + thoigian + `</td>
				<td class="noPadding"> <i class="fa fa-trash" onclick="xoaSanPhamTrongGioHang(` + i + `)"></i> </td>
			</tr>
		`;
		// Chú ý nháy cho đúng ở giamsoluong, tangsoluong
		totalPrice += thanhtien;
	}
	table.innerHTML = s;
}

function xoaSanPhamTrongGioHang(i) {
	if (window.confirm('Xác nhận hủy mua')) {
		currentuser.products.splice(i, 1);
		capNhatMoiThu();
	}
}


// Cập nhật số lượng lúc nhập số lượng vào input
function capNhatSoLuongFromInput(inp, masp) {
	var soLuongMoi = Number(inp.value);
	if (!soLuongMoi || soLuongMoi <= 0) soLuongMoi = 1;

	for (var p of currentuser.products) {
		if (p.ma == masp) {
			p.soluong = soLuongMoi;
		}
	}

	capNhatMoiThu();
}

function tangSoLuong(masp) {
	for (var p of currentuser.products) {
		if (p.ma == masp) {
			p.soluong++;
		}
	}

	capNhatMoiThu();
}

function giamSoLuong(masp) {
	for (var p of currentuser.products) {
		if (p.ma == masp) {
			if (p.soluong > 1) {
				p.soluong--;
			} else {
				return;
			}
		}
	}

	capNhatMoiThu();
}

function capNhatMoiThu() { // Mọi thứ
	animateCartNumber();

	// cập nhật danh sách sản phẩm trong localstorage
	setCurrentUser(currentuser);
	updateListUser(currentuser);

	// cập nhật danh sách sản phẩm ở table
	addProductToTable(currentuser);

	// Cập nhật trên header
	capNhat_ThongTin_CurrentUser();
}

