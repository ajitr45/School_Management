import { useEffect, useState } from "react";
import api from "../../services/api";

function Fees () {

    const [activeTab, setActiveTab] = useState("structures");

    const [feeStructures, setFeeStructures] = useState([]);
    const [studentFees, setStudentFees] = useState([]);
    const [payments, setPayments] = useState([]);

    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);


    // =====================================================
    // FEE STRUCTURE FORM
    // =====================================================

    const [feeStructureForm, setFeeStructureForm] = useState({
        school_class: "",
        academic_year: "",
        amount: "",
        due_date: "",
        is_active: true,
    });


    // =====================================================
    // STUDENT FEE FORM
    // =====================================================

    const [studentFeeForm, setStudentFeeForm] = useState({
        student: "",
        fee_structure: "",
    });


    // =====================================================
    // PAYMENT FORM
    // =====================================================

    const [paymentForm, setPaymentForm] = useState({
        student_fee: "",
        amount: "",
        payment_method: "CASH",
        transaction_id: "",
        remarks: "",
    });


    // =====================================================
    // GET DATA
    // =====================================================

    useEffect(() => {

        const getData = async () => {

            try {

                setLoading(true);
                setError("");

                const [
                    feeStructureResponse,
                    studentFeeResponse,
                    paymentResponse,
                    studentResponse,
                    classResponse,
                ] = await Promise.all([

                    api.get("fees/fee-structures/"),

                    api.get("fees/student-fees/"),

                    api.get("fees/fee-payments/"),

                    api.get("students/"),

                    api.get("academics/classes/"),

                ]);


                console.log("STUDENTS API:", studentResponse.data);


                // =====================================================
                // HANDLE PAGINATION
                // =====================================================

                const studentData = Array.isArray(studentResponse.data)
                    ? studentResponse.data
                    : studentResponse.data.results || [];


                const feeStructureData = Array.isArray(
                    feeStructureResponse.data
                )
                    ? feeStructureResponse.data
                    : feeStructureResponse.data.results || [];


                const studentFeeData = Array.isArray(
                    studentFeeResponse.data
                )
                    ? studentFeeResponse.data
                    : studentFeeResponse.data.results || [];


                const paymentData = Array.isArray(
                    paymentResponse.data
                )
                    ? paymentResponse.data
                    : paymentResponse.data.results || [];


                const classData = Array.isArray(
                    classResponse.data
                )
                    ? classResponse.data
                    : classResponse.data.results || [];


                setStudents(studentData);

                setFeeStructures(feeStructureData);

                setStudentFees(studentFeeData);

                setPayments(paymentData);

                setClasses(classData);


            } catch (error) {

                console.log(error.response?.data);

                setError(
                    error.response?.data?.detail ||
                    "Failed to load fee data"
                );

            } finally {

                setLoading(false);

            }

        };


        getData();

    }, []);


    // =====================================================
    // ADD
    // =====================================================

    const handleAdd = () => {

        setError("");
        setShowForm(true);


        if (activeTab === "structures") {

            setFeeStructureForm({
                school_class: "",
                academic_year: "",
                amount: "",
                due_date: "",
                is_active: true,
            });

        }


        if (activeTab === "student-fees") {

            setStudentFeeForm({
                student: "",
                fee_structure: "",
            });

        }


        if (activeTab === "payments") {

            setPaymentForm({
                student_fee: "",
                amount: "",
                payment_method: "CASH",
                transaction_id: "",
                remarks: "",
            });

        }

    };


    // =====================================================
    // CANCEL
    // =====================================================

    const handleCancel = () => {

        setShowForm(false);
        setError("");

    };


    // =====================================================
    // CREATE FEE STRUCTURE
    // =====================================================

    const createFeeStructure = async (e) => {

        e.preventDefault();

        try {

            setSaving(true);
            setError("");

            const response = await api.post(
                "fees/fee-structures/",
                feeStructureForm
            );


            setFeeStructures((prev) => [
                ...prev,
                response.data,
            ]);


            setShowForm(false);

        } catch (error) {

            console.log(error.response?.data);

            setError(
                error.response?.data?.amount?.[0] ||
                error.response?.data?.detail ||
                "Failed to create fee structure"
            );

        } finally {

            setSaving(false);

        }

    };


    // =====================================================
    // CREATE STUDENT FEE
    // =====================================================

    const createStudentFee = async (e) => {

        e.preventDefault();

        try {

            setSaving(true);
            setError("");

            const response = await api.post(
                "fees/student-fees/",
                studentFeeForm
            );


            setStudentFees((prev) => [
                ...prev,
                response.data,
            ]);


            setShowForm(false);

        } catch (error) {

            console.log(error.response?.data);

            setError(
                error.response?.data?.non_field_errors?.[0] ||
                error.response?.data?.detail ||
                "Failed to assign fee"
            );

        } finally {

            setSaving(false);

        }

    };


    // =====================================================
    // CREATE PAYMENT
    // =====================================================

    const createPayment = async (e) => {

        e.preventDefault();

        try {

            setSaving(true);
            setError("");

            const response = await api.post(
                "fees/fee-payments/",
                paymentForm
            );


            setPayments((prev) => [
                ...prev,
                response.data,
            ]);


            const studentFeeResponse =
                await api.get("fees/student-fees/");


            const studentFeeData = Array.isArray(
                studentFeeResponse.data
            )
                ? studentFeeResponse.data
                : studentFeeResponse.data.results || [];


            setStudentFees(studentFeeData);

            setShowForm(false);

        } catch (error) {

            console.log(error.response?.data);

            setError(
                error.response?.data?.amount?.[0] ||
                error.response?.data?.detail ||
                "Failed to create payment"
            );

        } finally {

            setSaving(false);

        }

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div className="p-6">

                <p className="text-gray-500">
                    Loading fees...
                </p>

            </div>
        );

    }


    return (

        <div className="space-y-6">


            {/* =====================================================
                HEADER
            ===================================================== */}

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-2xl font-bold text-gray-800">
                        Fees
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage fee structures, student fees and payments
                    </p>

                </div>


                <button
                    onClick={handleAdd}
                    className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    + Add
                </button>

            </div>


            {/* =====================================================
                ERROR
            ===================================================== */}

            {error && (

                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>

            )}


            {/* =====================================================
                TABS
            ===================================================== */}

            <div className="bg-white rounded-xl shadow">


                <div className="flex border-b">


                    <button
                        onClick={() => {

                            setActiveTab("structures");
                            setShowForm(false);
                            setError("");

                        }}
                        className={`px-6 py-4 font-medium ${activeTab === "structures"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-500"
                            }`}
                    >
                        Fee Structures
                    </button>


                    <button
                        onClick={() => {

                            setActiveTab("student-fees");
                            setShowForm(false);
                            setError("");

                        }}
                        className={`px-6 py-4 font-medium ${activeTab === "student-fees"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-500"
                            }`}
                    >
                        Student Fees
                    </button>


                    <button
                        onClick={() => {

                            setActiveTab("payments");
                            setShowForm(false);
                            setError("");

                        }}
                        className={`px-6 py-4 font-medium ${activeTab === "payments"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-500"
                            }`}
                    >
                        Payments
                    </button>

                </div>


                <div className="p-6">


                    {/* =====================================================
                        FEE STRUCTURES
                    ===================================================== */}

                    {activeTab === "structures" && (

                        <>

                            {showForm && (

                                <form
                                    onSubmit={createFeeStructure}
                                    className="mb-6 bg-gray-50 p-5 rounded-xl"
                                >

                                    <h2 className="text-lg font-semibold mb-4">
                                        Add Fee Structure
                                    </h2>


                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                                        {/* CLASS */}

                                        <select
                                            value={
                                                feeStructureForm.school_class
                                            }
                                            onChange={(e) =>
                                                setFeeStructureForm({
                                                    ...feeStructureForm,
                                                    school_class:
                                                        e.target.value,
                                                })
                                            }
                                            className="border rounded-lg px-4 py-2.5"
                                            required
                                        >

                                            <option value="">
                                                Select Class
                                            </option>


                                            {classes.map(
                                                (schoolClass) => (

                                                    <option
                                                        key={schoolClass.id}
                                                        value={schoolClass.id}
                                                    >
                                                        {schoolClass.name}
                                                    </option>

                                                )
                                            )}

                                        </select>


                                        {/* ACADEMIC YEAR */}

                                        <input
                                            type="text"
                                            placeholder="Academic Year e.g. 2026-27"
                                            value={
                                                feeStructureForm.academic_year
                                            }
                                            onChange={(e) =>
                                                setFeeStructureForm({
                                                    ...feeStructureForm,
                                                    academic_year:
                                                        e.target.value,
                                                })
                                            }
                                            className="border rounded-lg px-4 py-2.5"
                                            required
                                        />


                                        {/* AMOUNT */}

                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            placeholder="Amount"
                                            value={
                                                feeStructureForm.amount
                                            }
                                            onChange={(e) =>
                                                setFeeStructureForm({
                                                    ...feeStructureForm,
                                                    amount:
                                                        e.target.value,
                                                })
                                            }
                                            className="border rounded-lg px-4 py-2.5"
                                            required
                                        />


                                        {/* DUE DATE */}

                                        <input
                                            type="date"
                                            value={
                                                feeStructureForm.due_date
                                            }
                                            onChange={(e) =>
                                                setFeeStructureForm({
                                                    ...feeStructureForm,
                                                    due_date:
                                                        e.target.value,
                                                })
                                            }
                                            className="border rounded-lg px-4 py-2.5"
                                            required
                                        />

                                    </div>


                                    <FormButtons
                                        saving={saving}
                                        saveText="Save Fee Structure"
                                        onCancel={handleCancel}
                                    />

                                </form>

                            )}


                            <div className="flex items-center justify-between mb-4">

                                <div>

                                    <h2 className="text-lg font-semibold">
                                        Fee Structures
                                    </h2>

                                    <p className="text-sm text-gray-500">
                                        {feeStructures.length} fee structures
                                    </p>

                                </div>

                            </div>


                            <Table>

                                <thead className="bg-gray-50">

                                    <tr>

                                        <Th>#</Th>
                                        <Th>Class</Th>
                                        <Th>Academic Year</Th>
                                        <Th>Amount</Th>
                                        <Th>Due Date</Th>
                                        <Th>Status</Th>

                                    </tr>

                                </thead>


                                <tbody className="divide-y">

                                    {feeStructures.length === 0 ? (

                                        <EmptyRow
                                            colSpan="6"
                                            text="No fee structures found."
                                        />

                                    ) : (

                                        feeStructures.map(
                                            (fee, index) => {

                                                const schoolClass =
                                                    classes.find(
                                                        (item) =>
                                                            item.id ===
                                                            fee.school_class
                                                    );


                                                return (

                                                    <tr key={fee.id}>

                                                        <Td>
                                                            {index + 1}
                                                        </Td>

                                                        <Td>
                                                            {schoolClass?.name ||
                                                                `Class #${fee.school_class}`}
                                                        </Td>

                                                        <Td>
                                                            {fee.academic_year}
                                                        </Td>

                                                        <Td>
                                                            ₹{fee.amount}
                                                        </Td>

                                                        <Td>
                                                            {fee.due_date}
                                                        </Td>

                                                        <Td>

                                                            <Status
                                                                status={
                                                                    fee.is_active
                                                                        ? "ACTIVE"
                                                                        : "INACTIVE"
                                                                }
                                                            />

                                                        </Td>

                                                    </tr>

                                                );

                                            }
                                        )

                                    )}

                                </tbody>

                            </Table>

                        </>

                    )}


                    {/* =====================================================
                        STUDENT FEES
                    ===================================================== */}

                    {activeTab === "student-fees" && (

                        <>

                            {showForm && (

                                <form
                                    onSubmit={createStudentFee}
                                    className="mb-6 bg-gray-50 p-5 rounded-xl"
                                >

                                    <h2 className="text-lg font-semibold mb-4">
                                        Assign Fee To Student
                                    </h2>


                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                                        {/* =====================================================
                                            STUDENT
                                        ===================================================== */}

                                        <select
                                            value={
                                                studentFeeForm.student
                                            }
                                            onChange={(e) =>
                                                setStudentFeeForm({
                                                    ...studentFeeForm,
                                                    student:
                                                        e.target.value,
                                                })
                                            }
                                            className="border rounded-lg px-4 py-2.5"
                                            required
                                        >

                                            <option value="">
                                                Select Student
                                            </option>


                                            {students.map(
                                                (student) => (

                                                    <option
                                                        key={student.id}
                                                        value={student.id}
                                                    >

                                                        {student.student_id ||
                                                            `ID-${student.id}`}

                                                        {" - "}

                                                        {student.admission?.student_name ||
                                                            "Student"}

                                                    </option>

                                                )
                                            )}

                                        </select>


                                        {/* =====================================================
                                            FEE STRUCTURE
                                        ===================================================== */}

                                        <select
                                            value={
                                                studentFeeForm.fee_structure
                                            }
                                            onChange={(e) =>
                                                setStudentFeeForm({
                                                    ...studentFeeForm,
                                                    fee_structure:
                                                        e.target.value,
                                                })
                                            }
                                            className="border rounded-lg px-4 py-2.5"
                                            required
                                        >

                                            <option value="">
                                                Select Fee Structure
                                            </option>


                                            {feeStructures.map(
                                                (fee) => {

                                                    const schoolClass =
                                                        classes.find(
                                                            (item) =>
                                                                item.id ===
                                                                fee.school_class
                                                        );


                                                    return (

                                                        <option
                                                            key={fee.id}
                                                            value={fee.id}
                                                        >

                                                            {schoolClass?.name ||
                                                                `Class #${fee.school_class}`}

                                                            {" - "}

                                                            {fee.academic_year}

                                                            {" - ₹"}

                                                            {fee.amount}

                                                        </option>

                                                    );

                                                }
                                            )}

                                        </select>

                                    </div>


                                    <FormButtons
                                        saving={saving}
                                        saveText="Assign Fee"
                                        onCancel={handleCancel}
                                    />

                                </form>

                            )}


                            <h2 className="text-lg font-semibold mb-4">
                                Student Fees
                            </h2>


                            <p className="text-sm text-gray-500 mb-4">
                                {studentFees.length} student fee records
                            </p>


                            <Table>

                                <thead className="bg-gray-50">

                                    <tr>

                                        <Th>#</Th>
                                        <Th>Student ID</Th>
                                        <Th>Student Name</Th>
                                        <Th>Fee Structure</Th>
                                        <Th>Amount</Th>
                                        <Th>Status</Th>

                                    </tr>

                                </thead>


                                <tbody className="divide-y">

                                    {studentFees.length === 0 ? (

                                        <EmptyRow
                                            colSpan="6"
                                            text="No student fees found."
                                        />

                                    ) : (

                                        studentFees.map(
                                            (fee, index) => {

                                                const structure =
                                                    feeStructures.find(
                                                        (item) =>
                                                            item.id ===
                                                            fee.fee_structure
                                                    );


                                                const schoolClass =
                                                    classes.find(
                                                        (item) =>
                                                            item.id ===
                                                            structure?.school_class
                                                    );


                                                return (

                                                    <tr key={fee.id}>

                                                        <Td>
                                                            {index + 1}
                                                        </Td>


                                                        {/* STUDENT ID */}

                                                        <Td>

                                                            <span className="font-medium text-blue-600">
                                                                {fee.student_id ||
                                                                    `ID-${fee.student}`}
                                                            </span>

                                                        </Td>


                                                        {/* STUDENT NAME */}

                                                        <Td>

                                                            <span className="font-medium text-gray-800">
                                                                {fee.student_name ||
                                                                    "Student"}
                                                            </span>

                                                        </Td>


                                                        {/* FEE STRUCTURE */}

                                                        <Td>

                                                            {schoolClass?.name ||
                                                                `Class #${structure?.school_class ||
                                                                "-"}`}

                                                            {" - "}

                                                            {structure?.academic_year ||
                                                                `Fee #${fee.fee_structure}`}

                                                        </Td>


                                                        {/* AMOUNT */}

                                                        <Td>

                                                            ₹
                                                            {structure?.amount ||
                                                                "-"}

                                                        </Td>


                                                        {/* STATUS */}

                                                        <Td>

                                                            <Status
                                                                status={
                                                                    fee.status
                                                                }
                                                            />

                                                        </Td>

                                                    </tr>

                                                );

                                            }
                                        )

                                    )}

                                </tbody>

                            </Table>

                        </>

                    )}


                    {/* =====================================================
                        PAYMENTS
                    ===================================================== */}

                    {activeTab === "payments" && (

                        <>

                            {showForm && (

                                <form
                                    onSubmit={createPayment}
                                    className="mb-6 bg-gray-50 p-5 rounded-xl"
                                >

                                    <h2 className="text-lg font-semibold mb-4">
                                        Add Payment
                                    </h2>


                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                                        {/* STUDENT FEE */}

                                        <select
                                            value={
                                                paymentForm.student_fee
                                            }
                                            onChange={(e) =>
                                                setPaymentForm({
                                                    ...paymentForm,
                                                    student_fee:
                                                        e.target.value,
                                                })
                                            }
                                            className="border rounded-lg px-4 py-2.5"
                                            required
                                        >

                                            <option value="">
                                                Select Student
                                            </option>


                                            {studentFees
                                                .filter(
                                                    (fee) =>
                                                        fee.status !==
                                                        "PAID"
                                                )
                                                .map(
                                                    (fee) => {

                                                        const structure =
                                                            feeStructures.find(
                                                                (item) =>
                                                                    item.id ===
                                                                    fee.fee_structure
                                                            );


                                                        const schoolClass =
                                                            classes.find(
                                                                (item) =>
                                                                    item.id ===
                                                                    structure?.school_class
                                                            );


                                                        return (

                                                            <option
                                                                key={fee.id}
                                                                value={fee.id}
                                                            >

                                                                {fee.student_id ||
                                                                    `ID-${fee.student}`}

                                                                {" - "}

                                                                {fee.student_name ||
                                                                    "Student"}

                                                                {" - "}

                                                                {schoolClass?.name ||
                                                                    "Class"}

                                                                {" - ₹"}

                                                                {structure?.amount ||
                                                                    "-"}

                                                                {" - "}

                                                                {fee.status}

                                                            </option>

                                                        );

                                                    }
                                                )}

                                        </select>


                                        {/* PAYMENT AMOUNT */}

                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            placeholder="Payment Amount"
                                            value={
                                                paymentForm.amount
                                            }
                                            onChange={(e) =>
                                                setPaymentForm({
                                                    ...paymentForm,
                                                    amount:
                                                        e.target.value,
                                                })
                                            }
                                            className="border rounded-lg px-4 py-2.5"
                                            required
                                        />


                                        {/* PAYMENT METHOD */}

                                        <select
                                            value={
                                                paymentForm.payment_method
                                            }
                                            onChange={(e) =>
                                                setPaymentForm({
                                                    ...paymentForm,
                                                    payment_method:
                                                        e.target.value,
                                                })
                                            }
                                            className="border rounded-lg px-4 py-2.5"
                                            required
                                        >

                                            <option value="CASH">
                                                Cash
                                            </option>

                                            <option value="UPI">
                                                UPI
                                            </option>

                                            <option value="CARD">
                                                Card
                                            </option>

                                        </select>


                                        {/* TRANSACTION ID */}

                                        <input
                                            type="text"
                                            placeholder="Transaction ID"
                                            value={
                                                paymentForm.transaction_id
                                            }
                                            onChange={(e) =>
                                                setPaymentForm({
                                                    ...paymentForm,
                                                    transaction_id:
                                                        e.target.value,
                                                })
                                            }
                                            className="border rounded-lg px-4 py-2.5"
                                        />


                                        {/* REMARKS */}

                                        <textarea
                                            placeholder="Remarks"
                                            value={
                                                paymentForm.remarks
                                            }
                                            onChange={(e) =>
                                                setPaymentForm({
                                                    ...paymentForm,
                                                    remarks:
                                                        e.target.value,
                                                })
                                            }
                                            className="border rounded-lg px-4 py-2.5 md:col-span-2"
                                            rows="3"
                                        />

                                    </div>


                                    <FormButtons
                                        saving={saving}
                                        saveText="Save Payment"
                                        onCancel={handleCancel}
                                    />

                                </form>

                            )}


                            <h2 className="text-lg font-semibold mb-4">
                                Payment History
                            </h2>


                            <Table>

                                <thead className="bg-gray-50">

                                    <tr>

                                        <Th>#</Th>
                                        <Th>Student ID</Th>
                                        <Th>Student Name</Th>
                                        <Th>Class</Th>
                                        <Th>Amount</Th>
                                        <Th>Method</Th>
                                        <Th>Receipt</Th>
                                        <Th>Date</Th>

                                    </tr>

                                </thead>


                                <tbody className="divide-y">

                                    {payments.length === 0 ? (

                                        <EmptyRow
                                            colSpan="8"
                                            text="No payments found."
                                        />

                                    ) : (

                                        payments.map(
                                            (payment, index) => {

                                                const studentFee =
                                                    studentFees.find(
                                                        (fee) =>
                                                            fee.id ===
                                                            payment.student_fee
                                                    );


                                                const structure =
                                                    feeStructures.find(
                                                        (fee) =>
                                                            fee.id ===
                                                            studentFee?.fee_structure
                                                    );


                                                const schoolClass =
                                                    classes.find(
                                                        (item) =>
                                                            item.id ===
                                                            structure?.school_class
                                                    );


                                                return (

                                                    <tr key={payment.id}>

                                                        <Td>
                                                            {index + 1}
                                                        </Td>


                                                        <Td>

                                                            {studentFee?.student_id ||
                                                                `ID-${studentFee?.student}`}

                                                        </Td>


                                                        <Td>

                                                            <span className="font-medium text-gray-800">
                                                                {payment.student_name ||
                                                                    studentFee?.student_name ||
                                                                    "Student"}
                                                            </span>

                                                        </Td>


                                                        <Td>

                                                            {schoolClass?.name ||
                                                                "-"}

                                                        </Td>


                                                        <Td>

                                                            ₹{payment.amount}

                                                        </Td>


                                                        <Td>

                                                            {payment.payment_method}

                                                        </Td>


                                                        <Td>

                                                            {payment.receipt_number}

                                                        </Td>


                                                        <Td>

                                                            {payment.payment_date}

                                                        </Td>

                                                    </tr>

                                                );

                                            }
                                        )

                                    )}

                                </tbody>

                            </Table>

                        </>

                    )}

                </div>

            </div>

        </div>

    );

}


// =====================================================
// FORM BUTTONS
// =====================================================

function FormButtons ({
    saving,
    saveText,
    onCancel,
}) {

    return (

        <div className="flex gap-3 mt-4">

            <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >

                {saving
                    ? "Saving..."
                    : saveText}

            </button>


            <button
                type="button"
                onClick={onCancel}
                className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
                Cancel
            </button>

        </div>

    );

}


// =====================================================
// TABLE
// =====================================================

function Table ({ children }) {

    return (

        <div className="overflow-x-auto">

            <table className="w-full">

                {children}

            </table>

        </div>

    );

}


// =====================================================
// TH
// =====================================================

function Th ({ children }) {

    return (

        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
            {children}
        </th>

    );

}


// =====================================================
// TD
// =====================================================

function Td ({ children }) {

    return (

        <td className="px-6 py-4 text-sm text-gray-600">
            {children}
        </td>

    );

}


// =====================================================
// EMPTY ROW
// =====================================================

function EmptyRow ({
    colSpan,
    text,
}) {

    return (

        <tr>

            <td
                colSpan={colSpan}
                className="px-6 py-10 text-center text-gray-500"
            >
                {text}
            </td>

        </tr>

    );

}


// =====================================================
// STATUS
// =====================================================

function Status ({ status }) {

    const classes = {

        PAID:
            "bg-green-100 text-green-700",

        PARTIAL:
            "bg-yellow-100 text-yellow-700",

        PENDING:
            "bg-red-100 text-red-700",

        ACTIVE:
            "bg-green-100 text-green-700",

        INACTIVE:
            "bg-gray-100 text-gray-600",

    };


    return (

        <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${classes[status] ||
                "bg-gray-100 text-gray-600"
                }`}
        >

            {status}

        </span>

    );

}


export default Fees;