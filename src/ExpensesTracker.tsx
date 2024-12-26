import { useEffect, useState } from "react";
import { Category } from "./Category";
import { Expense } from "./Expense";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import {
  Bot,
  BotMessageSquare,
  Minus,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { Card, CardContent } from "./components/ui/card";
import { ScrollArea, ScrollBar } from "./components/ui/scroll-area";
import {
  addExpensesToCategory,
  checkIfExpensesAreOverLimit,
  createNewCategory,
  deleteCategory,
  deleteExpenseFromCategory,
  findByExpensesName,
  getAiResponseOnHowToSaveMoreInCategory,
  getAiResponseOnHowToSaveMoreInGeneral,
  getCategories,
  getDailyAusgabe,
  getLimit,
  getMonthlyAusgaben,
  SetLimit,
} from "./Api";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "./components/ui/chart";
import { Close } from "@radix-ui/react-dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./components/ui/drawer";
import { toast, Toaster } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./components/ui/alert-dialog";
import { Badge } from "./components/ui/badge";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./components/ui/tooltip";

const ExpensesTracker: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState<string>("");
  const [newExpenseName, setNewExpenseName] = useState("");
  const [newExpenseAusgabe, setNewExpenseAusgabe] = useState<number>(0);
  const [newExpenseDate, setNewExpenseDate] = useState<Date>(new Date());
  const [searchForExpense, setSearchForExpense] = useState<boolean>(false);
  const [addButtonStep, setAddButtonStep] = useState(1);
  const [overLimit, setOverLimit] = useState<boolean>(false);
  const [searchExpense, setSearchExpense] = useState<string>("+");
  const [goal, setGoal] = useState(200);
  const [searchStep, setSearchStep] = useState(1);
  const [chartData, setChartData] = useState<
    { name: string; value: number }[] | undefined
  >(undefined);
  const [chartData2, setChartData2] = useState<
    { name: string; value: number }[] | undefined
  >(undefined);
  const [addingExpenseForCategory, setAddingExpenseForCategory] = useState<
    number | null
  >(null);
  const [aiResponse, setAiResponse] = useState<string>("");
  const [aiResponse2, setAiResponse2] = useState<string>("");

  const addCategory = async () => {
    if (newCategoryName == "") {
      toast.error("Name der Kategorie fehlt");
      return;
    }
    if (newCategoryColor == "") {
      toast.error(
        "Farbe bitte auswählen, wenn sie schwarz wollen einfach kurz reingehen und auswählen nochmal, damit das System es erkennt."
      );
      return;
    }

    await createNewCategory(newCategoryName, newCategoryColor);
    window.location.reload();
    try {
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  function onClick(adjustment: number) {
    setGoal(Math.max(20, Math.min(200000000, goal + adjustment)));
  }

  const GetDailyExpenses = async () => {
    try {
      const response = await getDailyAusgabe();
      const pieData = Object.keys(response).map((key) => ({
        name: key,
        value: response[key],
      }));
      setChartData(pieData);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  const GetLimit = async () => {
    try {
      const response = await getLimit();
      setGoal(response);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  const setLimit = async () => {
    try {
      await SetLimit(goal);
      window.location.reload();
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const CheckIfExpensesAreOverLimit = async () => {
    try {
      const response = await checkIfExpensesAreOverLimit();
      if (response) {
        setOverLimit(true);
        toast.error(
          "You are over your Limit, change it or stop adding Expenses"
        );
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const SearchForExpense = async () => {
    try {
      const response = await findByExpensesName(searchExpense);
      setCategories(response);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const GetMonthlyExpenses = async () => {
    try {
      const response = await getMonthlyAusgaben();
      const pieData = Object.keys(response).map((key) => ({
        name: key,
        value: response[key],
      }));
      setChartData2(pieData);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const deleteExpense = async (categoryId: number, id: number) => {
    try {
      await deleteExpenseFromCategory(categoryId, id);
      window.location.reload();
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const DeleteCategory = async (id: number) => {
    try {
      await deleteCategory(id);
      window.location.reload();
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const addExpense = async (id: number) => {
    try {
      await addExpensesToCategory(id, {
        name: newExpenseName,
        ausgabe: newExpenseAusgabe,
        ausgabeDatum: newExpenseDate,
      });
      setNewExpenseName("");
      setNewExpenseAusgabe(0);
      setNewExpenseDate(new Date());
      window.location.reload();
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const askAiForSavinMethod = async (id: number) => {
    try {
      const response = await getAiResponseOnHowToSaveMoreInCategory(id);
      setAiResponse(response);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const askAiForSavinMethodGeneral = async () => {
    try {
      const response = await getAiResponseOnHowToSaveMoreInGeneral();
      setAiResponse2(response);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const GetCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  useEffect(() => {
    SearchForExpense();
  });

  useEffect(() => {
    GetLimit();
  }, []);

  useEffect(() => {
    GetDailyExpenses();
    CheckIfExpensesAreOverLimit();
    GetMonthlyExpenses();
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#18181b] flex items-center justify-center">
      <div className="container mx-auto p-4 max-w-3xl bg-zinc-800 rounded-lg h-[900px]">
        <div className="flex justify-between ">
          <Toaster />
          <h1 className="text-3xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ml-3">
            Vaultify
          </h1>
          <Button
            onClick={() => {
              askAiForSavinMethodGeneral();
              document
                .querySelector<HTMLButtonElement>(".drawer-trigger2")
                ?.click();
            }}
            className="ml-5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90 border-none"
            variant="outline"
          >
            Get Analysis by AI
          </Button>

          {!searchForExpense ? (
            <Drawer>
              <DrawerTrigger asChild className="ml-auto mr-6">
                <Button variant="outline">Limit setzen</Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="mx-auto w-full max-w-sm ">
                  <DrawerHeader>
                    <DrawerTitle className="text-white">
                      Expense Limit
                    </DrawerTitle>
                    <DrawerDescription>
                      Stelle dein tägliches Limit ein
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4 pb-0">
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 shrink-0 rounded-full"
                        disabled={goal <= 20}
                        onClick={() => {
                          onClick(-10);
                        }}
                      >
                        <Minus />
                        <span className="sr-only">Decrease</span>
                      </Button>
                      <div className="flex-1 text-center">
                        <div className="text-7xl text-white font-bold tracking-tighter">
                          {goal} €
                        </div>
                        <div className="text-[0.70rem] uppercase text-muted-foreground">
                          Expense/day
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 shrink-0 rounded-full"
                        disabled={goal >= 200000000}
                        onClick={() => {
                          onClick(+10);
                        }}
                      >
                        <Plus />
                        <span className="sr-only">Increase</span>
                      </Button>
                    </div>
                  </div>
                  <DrawerFooter>
                    <Button
                      onClick={() => {
                        setLimit();
                      }}
                      className="bg-zinc-800"
                    >
                      Submit
                    </Button>
                    <DrawerClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>
          ) : null}

          {searchForExpense ? (
            <Input
              placeholder="Search for Expenses"
              className="w-[340px] bg-primary rounded-full border-none text-white"
              onChange={(e) => {
                setSearchExpense(e.target.value);
              }}
            ></Input>
          ) : null}
          <Button
            onClick={() => {
              setSearchForExpense(!searchForExpense);
              setSearchExpense("");
            }}
          >
            {searchForExpense ? <X /> : <Search />}
          </Button>
        </div>

        <div className="mb-4">
          <div className="flex space-x-2 mb-4">
            <Input
              type="text"
              placeholder="Neue Kategorie"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="rounded-full bg-primary border-none text-white"
            />
            <Input
              type="color"
              className="rounded-full bg-primary border-none text-white w-[60px]"
              onChange={(e) => setNewCategoryColor(e.target.value)}
            />
            <Button onClick={addCategory} className="rounded-full">
              <Plus className="h-4 w-4 mr-2" /> Kategorie
            </Button>
          </div>
          {!searchForExpense ? (
            <div className="flex justify-center items-center">
              <div className="flex justify-between w-[600px] items-center mb-4">
                <div className="w-[130px] h-[140px]">
                  <h2 className="text-sm font-bold text-white mb-1">
                    Gesamt Ausgaben
                  </h2>
                  <ChartContainer
                    config={{
                      food: {
                        label: "Food",
                        color: "hsl(var(--chart-1))",
                      },
                      transport: {
                        label: "Transport",
                        color: "hsl(var(--chart-2))",
                      },
                      entertainment: {
                        label: "Entertainment",
                        color: "hsl(var(--chart-3))",
                      },
                      utilities: {
                        label: "Utilities",
                        color: "hsl(var(--chart-4))",
                      },
                      others: {
                        label: "Others",
                        color: "hsl(var(--chart-5))",
                      },
                    }}
                    className="h-[120px] w-[120px]"
                  >
                    <PieChart>
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Pie
                        data={categories.map((category) => ({
                          name: category.name,
                          value: category.expenses.reduce(
                            (acc, expense) => acc + expense.ausgabe,
                            0
                          ),
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categories.map((category, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={`#${category.color}`}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                </div>
                <div className="w-[140px] h-[140px]">
                  <h2 className="text-sm font-bold text-white mb-1">
                    Tägliche Ausgaben
                  </h2>
                  <ChartContainer
                    config={{
                      food: {
                        label: "Food",
                        color: "hsl(var(--chart-1))",
                      },
                      transport: {
                        label: "Transport",
                        color: "hsl(var(--chart-2))",
                      },
                      entertainment: {
                        label: "Entertainment",
                        color: "hsl(var(--chart-3))",
                      },
                      utilities: {
                        label: "Utilities",
                        color: "hsl(var(--chart-4))",
                      },
                      others: {
                        label: "Others",
                        color: "hsl(var(--chart-5))",
                      },
                    }}
                    className="h-[120px] w-[120px]"
                  >
                    <PieChart>
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categories.map((category, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={`#${category.color}`}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                </div>
                <div className="w-[150px] h-[140px]">
                  <h2 className="text-sm font-bold text-white mb-1">
                    Monatliche Ausgaben
                  </h2>
                  <ChartContainer
                    config={{
                      food: {
                        label: "Food",
                        color: "hsl(var(--chart-2))",
                      },
                      transport: {
                        label: "Transport",
                        color: "hsl(var(--chart-3))",
                      },
                      entertainment: {
                        label: "Entertainment",
                        color: "hsl(var(--chart-4))",
                      },
                      utilities: {
                        label: "Utilities",
                        color: "hsl(var(--chart-5))",
                      },
                      others: {
                        label: "Others",
                        color: "hsl(var(--chart-6))",
                      },
                    }}
                    className="h-[120px] w-[120px]"
                  >
                    <PieChart>
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Pie
                        data={chartData2}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categories.map((category, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={`#${category.color}`}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <ScrollArea style={{ height: searchForExpense ? "770px" : "600px" }}>
          {categories.map((category) => (
            <Card
              key={category.categoryId}
              className="mb-4 overflow-hidden shadow-lg border-none bg-primary"
            >
              <div
                style={{ backgroundColor: `#${category.color}` }}
                className={`p-4 text-white font-bold text-lg flex justify-between`}
              >
                {category.name}
                <div className="flex justify-between gap-4">
                  {" "}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <BotMessageSquare
                          className="h-5 w-5 hover:cursor-pointer"
                          onClick={() => {
                            askAiForSavinMethod(category.categoryId);
                            document
                              .querySelector<HTMLButtonElement>(
                                ".drawer-trigger"
                              )
                              ?.click();
                          }}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Get Analysis by AI for {category.name} </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Minus
                    onClick={() => {
                      DeleteCategory(category.categoryId);
                    }}
                    className="h-5 w-5 hover:cursor-pointer"
                  />
                </div>
              </div>
              <CardContent>
                {category.expenses.length > 0 ? (
                  category.expenses.map((expense) => (
                    <div
                      key={expense.expenseId}
                      className="flex justify-between items-center p-2 rounded-md transition-colors duration-200 mt-2"
                    >
                      <div>
                        <p className="font-medium text-white">{expense.name}</p>
                        <p className="text-sm text-white">
                          {new Date(expense.ausgabeDatum).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <p className="font-bold mr-4 text-white">
                          {expense.ausgabe.toFixed(2)} €
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            deleteExpense(
                              category.categoryId,
                              expense.expenseId
                            )
                          }
                          className="rounded-full"
                        >
                          <Trash2 className="h-4 w-4 text-white" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Keine Ausgaben in dieser Kategorie
                  </p>
                )}
                <div className="mt-4 text-center">
                  {addingExpenseForCategory === category.categoryId && (
                    <div className="flex justify-start gap-4 mb-4">
                      <Input
                        className="border-none bg-zinc-800 rounded-full text-white pl-5"
                        type="text"
                        placeholder="Enter name for Expense"
                        onChange={(e) => {
                          setNewExpenseName(e.target.value);
                        }}
                      />
                      <Input
                        className="border-none bg-zinc-800 rounded-full text-white pl-5"
                        type="number"
                        placeholder="Enter ausgabe"
                        onChange={(e) => {
                          setNewExpenseAusgabe(parseInt(e.target.value));
                        }}
                      />
                      <Input
                        className="border-none bg-zinc-800 rounded-full text-white pl-5"
                        type="date"
                        placeholder="Enter Date"
                        onChange={(e) => {
                          const selectedDate = new Date(e.target.value);
                          setNewExpenseDate(selectedDate);
                        }}
                      />
                      {overLimit ? (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button className="bg-zinc-800 rounded-full hover:bg-zinc-800">
                              hinzufügen
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Du bist über deinem Limit bist du dir sicher,
                                das du fortfahren willst ?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Denke daran warum du dir ein Limit gesetzt hast
                                und überleg, ob du wirklich das tun möchtest
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => {
                                  addExpense(category.categoryId);
                                }}
                              >
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      ) : (
                        <Button
                          className="bg-zinc-800 rounded-full"
                          onClick={() => {
                            addExpense(category.categoryId);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          hinzufügen
                        </Button>
                      )}
                    </div>
                  )}
                  {addButtonStep == 1 ? (
                    <Button
                      className="rounded-full bg-zinc-800 hover:bg-zinc-800"
                      onClick={() => {
                        setAddingExpenseForCategory(
                          addingExpenseForCategory === category.categoryId
                            ? null
                            : category.categoryId
                        );
                        setAddButtonStep(2);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Neue Ausgabe hinzufügen
                    </Button>
                  ) : (
                    <Button
                      className="rounded-full bg-zinc-800 hover:bg-zinc-800"
                      onClick={() => {
                        setAddingExpenseForCategory(0);
                        setAddButtonStep(1);
                      }}
                    >
                      <X className="h-4 w-4 mr-2" /> Schließen
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </ScrollArea>
        <Drawer
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setAiResponse("");
            }
          }}
        >
          <DrawerTrigger asChild className="drawer-trigger">
            <span style={{ display: "none" }}></span>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle className="text-white">
                  AI Saving Suggestion in Category
                </DrawerTitle>
                <DrawerDescription>
                  So kannst du zukünftig Geld sparen
                </DrawerDescription>
              </DrawerHeader>
              <ScrollArea className="h-[500px]">
                <div className="p-4 pb-0">
                  <p className="text-white">{aiResponse}</p>
                </div>
              </ScrollArea>

              <DrawerFooter>
                <DrawerClose asChild>
                  <Button
                    onClick={() => {
                      setAiResponse("");
                    }}
                    variant="outline"
                  >
                    Close
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
        <Drawer
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setAiResponse2("");
            }
          }}
        >
          <DrawerTrigger asChild className="drawer-trigger2">
            <span style={{ display: "none" }}></span>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle className="text-white">
                  AI Saving Suggestion in General
                </DrawerTitle>
                <DrawerDescription>
                  So kannst du zukünftig Geld sparen
                </DrawerDescription>
              </DrawerHeader>
              <ScrollArea className="h-[500px]">
                <div className="p-4 pb-0">
                  <p className="text-white">{aiResponse2}</p>
                </div>
              </ScrollArea>

              <DrawerFooter>
                <DrawerClose asChild>
                  <Button
                    onClick={() => {
                      setAiResponse2("");
                    }}
                    variant="outline"
                  >
                    Close
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default ExpensesTracker;
