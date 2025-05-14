"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Edit, Loader2, Plus, Save, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";

const departmentFormSchema = z.object({
  name: z.string().min(2, {
    message: "Department name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  officerName: z.string().min(2, {
    message: "Officer name must be at least 2 characters.",
  }),
  officerTitle: z.string().min(2, {
    message: "Officer title must be at least 2 characters.",
  }),
});

const clearanceItemFormSchema = z.object({
  departmentId: z.string().min(1, {
    message: "Department is required.",
  }),
  name: z.string().min(2, {
    message: "Item name must be at least 2 characters.",
  }),
  description: z.string().optional(),
});

type DepartmentFormValues = z.infer<typeof departmentFormSchema>;
type ClearanceItemFormValues = z.infer<typeof clearanceItemFormSchema>;

export function ClearanceManagement() {
  const convex = useConvex();
  // @typescript-eslint/no-explicit-any
  const [departments, setDepartments] = useState<any[]>([]);
  // @typescript-eslint/no-explicit-any
  const [clearanceItems, setClearanceItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDepartmentDialogOpen, setIsDepartmentDialogOpen] = useState(false);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  // @typescript-eslint/no-explicit-any
  const [editingDepartment, setEditingDepartment] = useState<any | null>(null);
  // @typescript-eslint/no-explicit-any
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState("departments");

  const departmentForm = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: {
      name: "",
      description: "",
      officerName: "",
      officerTitle: "",
    },
  });

  const itemForm = useForm<ClearanceItemFormValues>({
    resolver: zodResolver(clearanceItemFormSchema),
    defaultValues: {
      departmentId: "",
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (editingDepartment) {
      departmentForm.reset({
        name: editingDepartment.name,
        description: editingDepartment.description || "",
        officerName: editingDepartment.officerName,
        officerTitle: editingDepartment.officerTitle,
      });
    } else {
      departmentForm.reset({
        name: "",
        description: "",
        officerName: "",
        officerTitle: "",
      });
    }
  }, [editingDepartment, departmentForm]);

  useEffect(() => {
    if (editingItem) {
      itemForm.reset({
        departmentId: editingItem.departmentId,
        name: editingItem.name,
        description: editingItem.description || "",
      });
    } else {
      itemForm.reset({
        departmentId: departments.length > 0 ? departments[0]._id : "",
        name: "",
        description: "",
      });
    }
  }, [editingItem, itemForm, departments]);

  async function fetchData() {
    setIsLoading(true);
    try {
      const [fetchedDepartments, fetchedItems] = await Promise.all([
        convex.query(api.clearance.getAllDepartments),
        convex.query(api.clearance.getAllItems),
      ]);
      setDepartments(fetchedDepartments);
      setClearanceItems(fetchedItems);
    } catch (error) {
      toast.error("Failed to fetch clearance data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmitDepartment(data: DepartmentFormValues) {
    setIsSubmitting(true);
    try {
      if (editingDepartment) {
        await convex.mutation(api.clearance.updateDepartment, {
          id: editingDepartment._id,
          ...data,
        });
        toast.success("Department updated successfully");
      } else {
        await convex.mutation(api.clearance.createDepartment, data);
        toast.success("Department added successfully");
      }
      setIsDepartmentDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error(
        editingDepartment
          ? "Failed to update department"
          : "Failed to add department"
      );
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onSubmitItem(data: ClearanceItemFormValues) {
    setIsSubmitting(true);
    try {
      if (editingItem) {
        await convex.mutation(api.clearance.updateItem, {
          id: editingItem._id,
          ...data,
        });
        toast.success("Clearance item updated successfully");
      } else {
        await convex.mutation(api.clearance.createItem, data);
        toast.success("Clearance item added successfully");
      }
      setIsItemDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error(
        editingItem
          ? "Failed to update clearance item"
          : "Failed to add clearance item"
      );
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteDepartment(id: string) {
    if (
      confirm(
        "Are you sure you want to delete this department? This will also delete all associated clearance items."
      )
    ) {
      try {
        await convex.mutation(api.clearance.removeDepartment, { id });
        toast.success("Department deleted successfully");
        fetchData();
      } catch (error) {
        toast.error("Failed to delete department");
        console.error(error);
      }
    }
  }

  async function handleDeleteItem(id: string) {
    if (confirm("Are you sure you want to delete this clearance item?")) {
      try {
        await convex.mutation(api.clearance.removeItem, { id });
        toast.success("Clearance item deleted successfully");
        fetchData();
      } catch (error) {
        toast.error("Failed to delete clearance item");
        console.error(error);
      }
    }
  }

  function handleEditDepartment(
    // @typescript-eslint/no-explicit-any
    department: any
  ) {
    setEditingDepartment(department);
    setIsDepartmentDialogOpen(true);
  }

  function handleAddNewDepartment() {
    setEditingDepartment(null);
    setIsDepartmentDialogOpen(true);
  }

  function handleEditItem(
    // @typescript-eslint/no-explicit-any
    item: any
  ) {
    setEditingItem(item);
    setIsItemDialogOpen(true);
  }

  function handleAddNewItem() {
    setEditingItem(null);
    setIsItemDialogOpen(true);
  }

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="items">Clearance Items</TabsTrigger>
        </TabsList>

        <TabsContent value="departments" className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={handleAddNewDepartment}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Department
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Departments</CardTitle>
            </CardHeader>
            <CardContent>
              {departments.length === 0 ? (
                <div className="flex h-[200px] flex-col items-center justify-center gap-4 text-center">
                  <p className="text-muted-foreground">No departments found</p>
                  <Button onClick={handleAddNewDepartment} variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Department
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Officer</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {departments.map((department) => (
                      <TableRow key={department._id}>
                        <TableCell className="font-medium">
                          {department.name}
                        </TableCell>
                        <TableCell>{department.officerName}</TableCell>
                        <TableCell>{department.officerTitle}</TableCell>
                        <TableCell className="max-w-[300px] truncate">
                          {department.description}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditDepartment(department)}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleDeleteDepartment(department._id)
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items" className="space-y-6">
          <div className="flex justify-end">
            <Button
              onClick={handleAddNewItem}
              disabled={departments.length === 0}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Clearance Item
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Clearance Items</CardTitle>
            </CardHeader>
            <CardContent>
              {departments.length === 0 ? (
                <div className="flex h-[200px] flex-col items-center justify-center gap-4 text-center">
                  <p className="text-muted-foreground">
                    Please add departments first before adding clearance items
                  </p>
                  <Button
                    onClick={() => {
                      setActiveTab("departments");
                      handleAddNewDepartment();
                    }}
                    variant="outline"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Department
                  </Button>
                </div>
              ) : clearanceItems.length === 0 ? (
                <div className="flex h-[200px] flex-col items-center justify-center gap-4 text-center">
                  <p className="text-muted-foreground">
                    No clearance items found
                  </p>
                  <Button onClick={handleAddNewItem} variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Clearance Item
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clearanceItems.map((item) => {
                      const department = departments.find(
                        (d) => d._id === item.departmentId
                      );
                      return (
                        <TableRow key={item._id}>
                          <TableCell className="font-medium">
                            {item.name}
                          </TableCell>
                          <TableCell>
                            {department ? department.name : "Unknown"}
                          </TableCell>
                          <TableCell className="max-w-[300px] truncate">
                            {item.description}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditItem(item)}
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteItem(item._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Department Dialog */}
      <Dialog
        open={isDepartmentDialogOpen}
        onOpenChange={setIsDepartmentDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingDepartment ? "Edit Department" : "Add New Department"}
            </DialogTitle>
            <DialogDescription>
              {editingDepartment
                ? "Update the department details below."
                : "Fill in the details to add a new department."}
            </DialogDescription>
          </DialogHeader>
          <Form {...departmentForm}>
            <form
              onSubmit={departmentForm.handleSubmit(onSubmitDepartment)}
              className="space-y-6"
            >
              <FormField
                control={departmentForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Library" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={departmentForm.control}
                  name="officerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Officer Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={departmentForm.control}
                  name="officerTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Officer Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Librarian" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={departmentForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of the department"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional description of the department.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDepartmentDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingDepartment ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {editingDepartment
                        ? "Update Department"
                        : "Add Department"}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Clearance Item Dialog */}
      <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit Clearance Item" : "Add New Clearance Item"}
            </DialogTitle>
            <DialogDescription>
              {editingItem
                ? "Update the clearance item details below."
                : "Fill in the details to add a new clearance item."}
            </DialogDescription>
          </DialogHeader>
          <Form {...itemForm}>
            <form
              onSubmit={itemForm.handleSubmit(onSubmitItem)}
              className="space-y-6"
            >
              <FormField
                control={itemForm.control}
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        {departments.map((department) => (
                          <option key={department._id} value={department._id}>
                            {department.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={itemForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Return all books" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={itemForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of the clearance item"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional description of what this clearance item entails.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsItemDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingItem ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {editingItem ? "Update Item" : "Add Item"}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
