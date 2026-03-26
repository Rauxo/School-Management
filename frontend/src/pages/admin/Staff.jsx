import React, { useState } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import DataTable from "@/components/common/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2, Edit2, UserPlus, Eye } from "lucide-react";
import {
  useGetStaffQuery,
  useAddStaffMutation,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
} from "@/api/services/staffApi";
import { useGetBatchesQuery } from "@/api/services/batchesApi";
import Modal from "@/components/common/Modal";
import { Input } from "@/components/ui/Input";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Download } from "lucide-react";

const Staff = () => {
  const { data: staff, isLoading } = useGetStaffQuery();
  const { data: batches } = useGetBatchesQuery();
  const [addStaff, { isLoading: isAdding }] = useAddStaffMutation();
  const [updateStaff, { isLoading: isUpdating }] = useUpdateStaffMutation();
  const [deleteStaff] = useDeleteStaffMutation();

  const [isModalOpen, setModalOpen] = useState(false);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const initialForm = {
    name: "",
    email: "",
    password: "",
    employeeId: "",
    designation: "",
    salary: "",
    phone: "",
    address: "",
    assignedBatches: [],
    image: null,
  };
  const [formData, setFormData] = useState(initialForm);

  const handleExport = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text("Staff Directory", 14, 22);
      doc.setFontSize(11);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

      const tableData = (staff || []).map((s) => [
        s.user?.name || "N/A",
        s.employeeId || "N/A",
        s.designation || "N/A",
        s.user?.email || "N/A",
        `₹${s.salary?.toLocaleString()}`,
      ]);

      autoTable(doc, {
        startY: 40,
        head: [["Name", "Employee ID", "Designation", "Email", "Salary"]],
        body: tableData,
        theme: "grid",
        headStyles: { fillColor: [107, 33, 168] }, // Purple 800
      });

      doc.save("staff_directory.pdf");
      toast.success("Staff exported as PDF");
    } catch (err) {
      toast.error("Export failed");
    }
  };

  const columns = [
    {
      header: "Staff Member",
      cell: (row) => (
        <div className="flex items-center gap-3">
          {row.image ? (
            <img
              src={`http://localhost:5000${row.image}`}
              alt={row.user?.name}
              className="size-9 rounded-xl object-cover border border-slate-200"
            />
          ) : (
            <div className="size-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              {row.user?.name?.charAt(0)}
            </div>
          )}
          <div>
            <p className="font-bold text-slate-800">{row.user?.name}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
              {row.employeeId}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Designation",
      accessor: "designation",
      cell: (row) => <Badge variant="outline">{row.designation}</Badge>,
    },
    {
      header: "Assigned Batches",
      cell: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.assignedBatches?.length > 0 ? (
            row.assignedBatches.map((b) => (
              <Badge
                key={b._id}
                variant="secondary"
                className="text-xs bg-blue-50 text-blue-600 border-blue-200"
              >
                {b.name}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-slate-400">None</span>
          )}
        </div>
      ),
    },
    { header: "Email", accessor: "email", cell: (row) => row.user?.email },
    {
      header: "Salary",
      accessor: "salary",
      cell: (row) => (
        <span className="font-mono font-bold">
          ₹{row.salary?.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="size-8 p-0 text-slate-400 hover:text-primary"
            onClick={() => handleViewDetails(row)}
            title="View Details"
          >
            <Eye size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="size-8 p-0 text-slate-400 hover:text-primary"
            onClick={() => handleEditClick(row)}
            title="Edit"
          >
            <Edit2 size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="size-8 p-0 text-red-400 hover:text-red-600"
            onClick={() => handleDelete(row._id)}
            title="Delete"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      ),
    },
  ];

  const handleViewDetails = (member) => {
    setSelectedStaff(member);
    setDetailModalOpen(true);
  };

  const handleEditClick = (member) => {
    setEditMode(true);
    setCurrentId(member._id);
    setFormData({
      name: member.user?.name || "",
      email: member.user?.email || "",
      password: "",
      employeeId: member.employeeId || "",
      designation: member.designation || "",
      salary: member.salary || "",
      phone: member.phone || "",
      address: member.address || "",
      assignedBatches: member.assignedBatches
        ? member.assignedBatches.map((b) => b._id)
        : [],
      image: null,
    });
    setModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditMode(false);
    setFormData(initialForm);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      try {
        await deleteStaff(id).unwrap();
        toast.success("Staff member removed successfully");
      } catch (err) {
        toast.error("Failed to remove staff");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "assignedBatches") {
        // Send the entire array as a JSON string
        data.append("assignedBatches", JSON.stringify(formData[key]));
      } else if (key === "image" && formData[key]) {
        data.append("image", formData[key]);
      } else if (key !== "image") {
        data.append(key, formData[key]);
      }
    });

    try {
      if (isEditMode) {
        await updateStaff({ id: currentId, data }).unwrap();
        toast.success("Staff details updated successfully");
      } else {
        await addStaff(data).unwrap();
        toast.success("Staff member registered successfully");
      }
      setModalOpen(false);
      setFormData(initialForm);
    } catch (err) {
      toast.error(err.data?.message || "Failed to save staff");
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            Staff Directory
          </h1>
          <p className="text-slate-500 text-sm">
            Manage faculty and administrative members.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download size={18} /> Export PDF
          </Button>
          <Button onClick={handleOpenAdd} className="gap-2">
            <UserPlus size={18} /> Register Staff
          </Button>
        </div>
      </div>

      <DataTable columns={columns} data={staff || []} isLoading={isLoading} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditMode ? "Edit Staff Member" : "Register Staff Member"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">
              Staff Image
            </label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.files[0] })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">
                Full Name
              </label>
              <Input
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">
                Email
              </label>
              <Input
                placeholder="Email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">
              {isEditMode
                ? "New Password (Leave blank to keep same)"
                : "Initial Password"}
            </label>
            <Input
              placeholder="Initial Password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required={!isEditMode}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">
                Employee ID
              </label>
              <Input
                placeholder="Employee ID"
                value={formData.employeeId}
                onChange={(e) =>
                  setFormData({ ...formData, employeeId: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">
                Designation
              </label>
              <Input
                placeholder="Designation"
                value={formData.designation}
                onChange={(e) =>
                  setFormData({ ...formData, designation: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">
                Monthly Salary (₹)
              </label>
              <Input
                placeholder="Monthly Salary (₹)"
                type="number"
                value={formData.salary}
                onChange={(e) =>
                  setFormData({ ...formData, salary: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">
                Phone
              </label>
              <Input
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">
              Address
            </label>
            <Input
              placeholder="Address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          </div>

          {isEditMode && (
            <div className="space-y-2 pt-2">
              <label className="text-sm font-semibold text-slate-700">
                Assigned Batches
              </label>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                {batches?.map((batch) => (
                  <label
                    key={batch._id}
                    className="flex items-center gap-2 text-sm border p-2 rounded-md hover:bg-slate-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.assignedBatches.includes(batch._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            assignedBatches: [
                              ...formData.assignedBatches,
                              batch._id,
                            ],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            assignedBatches: formData.assignedBatches.filter(
                              (id) => id !== batch._id,
                            ),
                          });
                        }
                      }}
                      className="rounded border-slate-300 text-primary focus:ring-primary"
                    />
                    {batch.name}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-end mt-6 pt-4 border-t">
            <Button
              variant="outline"
              type="button"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isAdding || isUpdating}>
              {isAdding || isUpdating
                ? "Processing..."
                : isEditMode
                  ? "Update"
                  : "Register"}
            </Button>
          </div>
        </form>
      </Modal>
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title="Staff Member Details"
      >
        {selectedStaff && (
          <div className="space-y-6 py-2">
            <div className="flex items-center gap-4 border-b pb-6">
              {selectedStaff.image ? (
                <img
                  src={`http://localhost:5000${selectedStaff.image}`}
                  alt={selectedStaff.user?.name}
                  className="size-16 rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
                />
              ) : (
                <div className="size-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl font-bold uppercase">
                  {selectedStaff.user?.name?.charAt(0)}
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {selectedStaff.user?.name}
                </h3>
                <p className="text-slate-500 font-medium">
                  {selectedStaff.employeeId}
                </p>
                <Badge
                  variant={
                    selectedStaff.status === "active" ? "success" : "secondary"
                  }
                  className="mt-1 uppercase text-[10px]"
                >
                  {selectedStaff.status || "Active"}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Email Address
                </p>
                <p className="text-sm text-slate-700 font-medium">
                  {selectedStaff.user?.email}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Phone Number
                </p>
                <p className="text-sm text-slate-700 font-medium">
                  {selectedStaff.phone || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Designation
                </p>
                <p className="text-sm text-slate-700 font-medium">
                  {selectedStaff.designation}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Salary
                </p>
                <p className="text-sm text-slate-700 font-medium">
                  ₹{selectedStaff.salary?.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Residential Address
              </p>
              <p className="text-sm text-slate-700 font-medium">
                {selectedStaff.address || "N/A"}
              </p>
            </div>

            <div className="border-t pt-6">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">
                Assigned Batches
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedStaff.assignedBatches?.length > 0 ? (
                  selectedStaff.assignedBatches.map((b) => (
                    <Badge
                      key={b._id}
                      variant="secondary"
                      className="bg-blue-50 text-blue-600 border-blue-100 px-3"
                    >
                      {b.name}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-slate-400 italic">
                    No batches assigned yet.
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => setDetailModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
};

export default Staff;
