import Course from "../models/Course.js";

// Lấy tất cả khóa học, có thể phân trang, lọc category, tìm kiếm, sắp xếp
export const getCourses = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, search, sort } = req.query;
    const query = {};
    if (category && category !== "all") query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Xác định cách sắp xếp
    let sortOption = { createdAt: -1 }; // Mặc định: mới nhất
    if (sort === "students")
      sortOption = { students: -1 }; // Nhiều học viên nhất
    else if (sort === "rating")
      sortOption = { rating: -1 }; // Đánh giá cao nhất
    else if (sort === "price-asc") sortOption = { price: 1 }; // Giá thấp -> cao
    else if (sort === "price-desc") sortOption = { price: -1 }; // Giá cao -> thấp

    const total = await Course.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    const courses = await Course.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort(sortOption);
    res.json({ data: courses, total, totalPages });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// Thêm mới khóa học
export const createCourse = async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Tạo khóa học thất bại", error: err.message });
  }
};

// Lấy chi tiết 1 khóa học
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course)
      return res.status(404).json({ message: "Không tìm thấy khóa học" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// Xóa khóa học
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course)
      return res.status(404).json({ message: "Không tìm thấy khóa học" });
    res.json({ message: "Đã xóa khóa học" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// Cập nhật khóa học
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!course)
      return res.status(404).json({ message: "Không tìm thấy khóa học" });
    res.json(course);
  } catch (err) {
    res.status(400).json({ message: "Cập nhật thất bại", error: err.message });
  }
};

